import { NextResponse } from 'next/server'
import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

export async function POST() {
  try {
    const client = getOpenAIClient()

    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const prompt = `Create a cinematic three-panel vertical collage (9:16 aspect ratio) featuring an Asian young woman in film-style portraits:

TOP PANEL - Close-up upper body shot:
A cinematic close-up portrait of a young Asian woman with delicate facial features. She wears a nude beige sheer flowing dress with an open back. Her head is adorned with a fine beige veil that crosses diagonally over her neck to the back, covering her long hair. The veil is gently blown by wind towards the back left. Soft, warm-toned lighting with subtle shadows. Background shows blurred columns of an ancient Greek temple. Film grain texture, 8K resolution, cinematic quality.

MIDDLE PANEL - Full body shot from behind:
A cinematic medium full-body shot from behind of the same Asian woman. She wears the nude beige sheer dress with exposed back, fair glowing skin. The dress and veil flow gracefully in the wind. A long transparent beige veil is wrapped across her neck and flows dramatically behind her towards the camera. Background features the majestic Luxor Temple with sandstone columns and obelisks at sunset in the desert, creating a sacred, mythological atmosphere. Classic film grain texture, warm golden tones.

BOTTOM PANEL - Extreme close-up facial shot:
A cinematic extreme close-up of half the face of the same Asian woman, head slightly tilted down, gazing into the distance with a contemplative expression. A few strands of hair blown by wind across her cheek. Soft, warm lighting with gentle shadows. Background shows blurred ancient Greek temple stone walls. Low saturation colors, film aesthetic, intimate framing.

OVERALL STYLE:
- All three panels arranged vertically (top-middle-bottom) in a single 9:16 image
- Unified cinematic color grading: warm golden tones with low saturation
- Subtle vignette effect around edges for depth and atmosphere
- Consistent film grain texture throughout
- Professional photography quality with shallow depth of field
- Dreamy, ethereal, mythological mood
- Each panel should be clearly separated but visually cohesive`

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1792',
      quality: 'hd',
      style: 'natural',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating collage:', error)
    return NextResponse.json(
      { error: 'Failed to generate collage' },
      { status: 500 }
    )
  }
}
