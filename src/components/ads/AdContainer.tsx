import DisplayAd from '@components/DisplayAd'

interface Props {
  slot: string
}

export default function AdContainer({ slot }: Props) {
  return (
    <div className="my-6 flex justify-center">
      <DisplayAd slot={slot} />
    </div>
  )
}