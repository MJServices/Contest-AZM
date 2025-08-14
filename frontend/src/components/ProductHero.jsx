import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Share2 } from 'lucide-react';

const ProductHero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const productImages = [
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Product Images */}
        <div className="relative group">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={productImages[currentImage]}
              alt="Luxury Interior Design"
              className="w-full h-96 lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Image Controls */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 p-3 rounded-full opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 p-3 rounded-full opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImage 
                      ? 'bg-white scale-110' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-4 mt-6">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                  index === currentImage 
                    ? 'ring-4 ring-cyan-400 scale-105' 
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium Collection
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-white/80 text-sm ml-1">(4.9)</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Luxurious
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Interior Design
              </span>
            </h1>

            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Transform your living space into a masterpiece of modern elegance. 
              Our premium interior design collection combines functionality with 
              breathtaking aesthetics to create spaces that inspire and transform lives.
            </p>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 transition-all duration-300 ${
                isLiked ? 'text-pink-400' : 'text-white/60 hover:text-pink-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>Add to Wishlist</span>
            </button>
            <button className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;