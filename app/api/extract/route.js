import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse JSON request body
    const { imageBase64 } = await request.json();
    
    if (!imageBase64) {
      return NextResponse.json({
        success: false, 
        message: "Missing imageBase64 parameter" 
      }, { status: 400 });
    }
    
    // Remove prefix if present
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
    
    // Decode base64 image to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Convert to string and search for JSON
    const dataString = imageBuffer.toString('utf8');
    
    // Pattern to find JSON object with expected fields
    const jsonRegex = /{[^{]*"name"[^}]*"organization"[^}]*"address"[^}]*"mobile"[^}]*}/;
    const match = dataString.match(jsonRegex);
    
    if (match) {
      try {
        const parsedJson = JSON.parse(match[0]);
        return NextResponse.json({
          success: true,
          data: parsedJson,
          message: "Successfully extracted JSON from image"
        });
      } catch (e) {
        return NextResponse.json({
          success: false,
          message: "Found JSON-like data but couldn't parse it"
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      success: false,
      message: "Could not extract JSON from the image"
    }, { status: 400 });
    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      success: false,
      message: `Error: ${error.message}`
    }, { status: 500 });
  }
}