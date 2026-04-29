import io
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from PIL import Image
from rembg import remove, new_session

app = FastAPI()

# Initialize the rembg session once to prevent reloading the model on every request
# We use u2net as it's robust and generally provides excellent quality
try:
    session = new_session("u2net")
except Exception as e:
    print(f"Error initializing rembg session: {e}")
    session = None

@app.post("/remove-bg")
async def remove_background(image: UploadFile = File(...)):
    try:
        # Read the uploaded image bytes
        contents = await image.read()
        
        # Load image with PIL and force RGB format
        # This prevents any pre-existing alpha channels from confusing the model
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Use rembg to remove the background
        # post_process_mask=True applies a guided filter to smooth edges and reduce ghosting
        output_image = remove(
            input_image, 
            session=session,
            post_process_mask=True,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        
        # Save output to buffer as PNG (which supports transparency)
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG', compress_level=6)
        
        # Return the processed image
        return Response(content=img_byte_arr.getvalue(), media_type="image/png")
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Python background remover is running"}
