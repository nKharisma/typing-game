import '../css/HomePage.css'

export default function HomePage() {
  return (
    <div className='home-page__container'>
      <div className='home-page'>
        <div className='home-page__block-1'>
          <div className='home-page__block-1-text-container'>
            <h1>Welcome to TypeCode!</h1>
            <p>
              Our mission is to help you build muscle memory for coding,
              and to have fun while doing it!
            </p>
          </div>
          <div className='home-page__block-1-image-container'>
            <img className='home-page__block-1-image' src="assets/tile022_scaled.png" alt="Spaceship" />
          </div>
        </div>
      </div>
    </div>
  );
}
