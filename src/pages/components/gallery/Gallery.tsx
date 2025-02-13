import api from '@/utils/api';
import { useModal } from '@/pages/components/modal/Modal';
import GalleryModal from '@/pages/components/modal/GalleryModal';

const Gallery = () => {
  const { data: images} = api.gallery.getAll.useQuery(undefined, {})
  const [modal, showModal] = useModal();

  const openModal = (image: string) => {
    showModal('이미지', (onClose) => (
      <GalleryModal image={image} />
    ))
  }

  return (
    <>
      {modal}
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-4 pb-12">
        {images && images.map((image) => (
          <div className="image-container md:max-h-[300px] max-h-[350px]">
            <img
              onClick={() => openModal(image.image)}
              className="w-full h-[350px] sm:h-[150px] rounded-lg cursor-pointer transition duration-300 hover:scale-103 hover:-translate-y-1"
              src={image.image}
              alt=""
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Gallery;