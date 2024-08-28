import sharp from 'sharp'

export async function validateBase64(base64String: string) {
  try {
    // const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64String, 'base64')

    const image = sharp(buffer)

    const metadata = await image.metadata()
    if (metadata !== undefined) {
      return metadata.width! > 0 && metadata.height! > 0
    }
    return false
  } catch (error) {
    return false
  }
}
