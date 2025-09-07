import { type NextRequest, NextResponse } from "next/server"

// Color palettes for different avatar styles
const colorPalettes = {
  pastel: [
    ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
    ["#FFD1DC", "#FFE4B5", "#E6E6FA", "#F0FFF0", "#F0F8FF"],
    ["#FFEAA7", "#DDA0DD", "#98FB98", "#F5DEB3", "#FFE4E1"],
    ["#FFF0F5", "#F0FFFF", "#F5FFFA", "#FFFACD", "#FFE4E1"],
  ],
  vibrant: [
    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
    ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#E17055"],
    ["#00B894", "#00CEC9", "#0984E3", "#6C5CE7", "#E84393"],
    ["#FF7675", "#74B9FF", "#00CEC9", "#FDCB6E", "#E84393"],
  ],
  monochrome: [
    ["#2D3436", "#636E72", "#B2BEC3", "#DDD", "#FFF"],
    ["#000", "#333", "#666", "#999", "#CCC"],
    ["#1A1A1A", "#404040", "#808080", "#B3B3B3", "#E6E6E6"],
    ["#212529", "#495057", "#6C757D", "#ADB5BD", "#DEE2E6"],
  ],
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

function getRandomFromSeed(seed: number, max: number): number {
  const x = Math.sin(seed) * 10000
  return Math.floor((x - Math.floor(x)) * max)
}

function generateAvatar(text: string, style = "pastel", size = 120): string {
  const hash = hashString(text)
  const paletteIndex = getRandomFromSeed(hash, colorPalettes[style as keyof typeof colorPalettes].length)
  const palette = colorPalettes[style as keyof typeof colorPalettes][paletteIndex]

  const color1 = palette[getRandomFromSeed(hash + 1, palette.length)]
  const color2 = palette[getRandomFromSeed(hash + 2, palette.length)]

  // Generate random variations for the geometric elements
  const rotation = getRandomFromSeed(hash + 3, 360)
  const translateX = getRandomFromSeed(hash + 4, 10) - 5
  const translateY = getRandomFromSeed(hash + 5, 10) - 5
  const scale = 0.9 + getRandomFromSeed(hash + 6, 20) / 100 // 0.9 to 1.1
  const faceRotation = getRandomFromSeed(hash + 7, 20) - 10 // -10 to 10 degrees

  // Eye positions and sizes
  const leftEyeX = 12 + getRandomFromSeed(hash + 8, 4)
  const rightEyeX = 20 + getRandomFromSeed(hash + 9, 4)
  const eyeY = 14 + getRandomFromSeed(hash + 10, 2)
  const eyeWidth = 1.5
  const eyeHeight = 2

  // Mouth variations
  const mouthType = getRandomFromSeed(hash + 11, 3) // 0, 1, or 2 for different mouth shapes
  const mouthY = 19 + getRandomFromSeed(hash + 12, 2)

  // Generate unique mask ID
  const maskId = `mask-${hash}`

  let mouthPath = ""
  if (mouthType === 0) {
    mouthPath = `<path d="M13,${mouthY} a1,0.75 0 0,0 10,0" fill="#FFFFFF"/>`
  } else if (mouthType === 1) {
    mouthPath = `<path d="M15 ${mouthY}c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" strokeLinecap="round"/>`
  } else {
    mouthPath = `<path d="M13,${mouthY + 1} a1,0.75 0 0,0 10,0" fill="#FFFFFF"/>`
  }

  return `
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
        <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
      </mask>
      <g mask="url(#${maskId})">
        <rect width="36" height="36" fill="${color1}"></rect>
        <rect x="0" y="0" width="36" height="36" 
              transform="translate(${translateX} ${translateY}) rotate(${rotation} 18 18) scale(${scale})" 
              fill="${color2}" rx="36"></rect>
        <g transform="translate(${translateX} ${translateY}) rotate(${faceRotation} 18 18)">
          ${mouthPath}
          <rect x="${leftEyeX}" y="${eyeY}" width="${eyeWidth}" height="${eyeHeight}" rx="1" stroke="none" fill="#FFFFFF"></rect>
          <rect x="${rightEyeX}" y="${eyeY}" width="${eyeWidth}" height="${eyeHeight}" rx="1" stroke="none" fill="#FFFFFF"></rect>
        </g>
      </g>
    </svg>
  `.trim()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(request.url)
    
    // Extract params from URL path
    const pathSegments = pathname.split('/').filter(Boolean)
    // The last segments after /api/avatar/ are our params
    const paramSegments = pathSegments.slice(2) // Skip 'api' and 'avatar'
    
    // Get text from URL params (e.g., /api/avatar/John+Doe or /api/avatar/JD)
    const text = paramSegments.join(" ").replace(/\+/g, " ") || "AA"

    // Get optional query parameters
    const style = searchParams.get("style") || "pastel"
    const sizeParam = searchParams.get("size") || "80"
    const size = Math.min(Math.max(Number.parseInt(sizeParam), 16), 512) // Limit size between 16-512

    // Validate style
    const validStyles = ["pastel", "vibrant", "monochrome"]
    const finalStyle = validStyles.includes(style) ? style : "pastel"

    const svg = generateAvatar(text, finalStyle, size)

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Avatar generation error:", error)
    return new NextResponse("Error generating avatar", { status: 500 })
  }
}
