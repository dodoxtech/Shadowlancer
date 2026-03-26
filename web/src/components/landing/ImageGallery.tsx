const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf-X5r7rVbPJj7W97X_LytsSS6v8Is9LEa38Rdi8dq9A96M8atDGbcrINQC_2kxUCEQwm8zQNO9WaYSz-3fQAALtJOQkSVXjvWBSEhD9iVwwHtCKpMY80syoRCzv6peTJmouQ7vADKFqnLDg8UbUXTFFwbprgl4OmsaNFLvc1oY9mzsUdTWVcVhyVCw5ANQhvyfSPfvT35925eFDoyZ_NMkjvISHEKvYg0FjAcZ2j1NIGWMhe7pkXu9TkO8Gfb8QDjUSkZ2tjVydeX",
    alt: "Minimalist lamp on a wooden table with soft light",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8BC3ddYxDz1DomgMqSJ7poev870KV7LkV_FZX3BBO0ay3n-q8ulM0JiJprEUcEawm9pcZezf4A_zuBXVRvJBdB-WJKTtNzAbJoNCiiqwPUQtwFKnPZ1k9iRb-PRMaxwcrEP1pE-bBY3gNbxbFeWIQdzkM6MhUlAGenj9glm3QoBnKYLj7SvxOZ324V7ArpwO2PDMVrDRYSfnXD2GvsBEaoeINtWRco_hKJ_bF5qdZObuWgLboNAxY5kmKorOnA5pFBJGkbQGcRyCa",
    alt: "Glass skyscraper with sky reflections",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSNozdh0pJpW5LmqzwwH3OhCvQ3e5_nzIcXmkPN-FQaqY6xBl-vD_SOLxAjN9KdA2R-oV7r5kObC4eVVlvRXpEu4xoSdwqDSOMp-QgCOEcID-L7ytN0pFf2z-M-NsPrMPu4Kl7QruVgc0ZCBBEexY-eyHaxRwQDdjnvn0FCmqnmnwZsxQDUA_JC9QYXePA9i0u1sp6n2a5DB0oO9Z5EkDvM2EvRoVzgquRd_BRqLCOeoyOG5Z1eh2pTo5cX2GHVjw5apRVoKfkOGjX",
    alt: "Macbook on a white desk with plant",
  },
];

export function ImageGallery() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[500px]">
        {galleryImages.map((image) => (
          <div key={image.alt} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
