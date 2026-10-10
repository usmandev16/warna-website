export interface ImageSource {
  src: string
  width: number
}

export interface ResponsiveImage {
  width: number
  height: number
  avif: ImageSource[]
  webp: ImageSource[]
  placeholder: string
}
