

const GalleryModal = ({image}: {image: string}) => {

  return (
    <div className="flex flex-1 justify-center items-center xl:w-[1200px] xl:h-[1050px] md:w-[700px] md:h-[550px] w-full h-auto">
      <img src={image} className="w-full h-full" alt="not founded"/>
    </div>
  )
}

export default GalleryModal;