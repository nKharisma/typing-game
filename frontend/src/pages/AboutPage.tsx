import '../css/AboutPage.css'

export default function AboutPage() {
  return (
    <div className='about-page'>
      <div id="about-us">
        <h1>About Us</h1>
        <p>
          Welcome to the TypeCode website!
          This platform is designed to help you build coding muscle memory efficiently and while having fun.
        </p>
        <h2>Our Team</h2>
        <ul>
          <li>
            <strong>Reed Holton</strong> - Project Manager
          </li>
          <li>
            <strong>SeNiah McField</strong> - Frontend Developer
          </li>
          <li>
            <strong>Ethan Dean</strong> - Frontend Developer
          </li>
          <li>
            <strong>Terry Achille</strong> - API Developer
          </li>
          <li>
            <strong>Marco Plasencia</strong> - API Developer
          </li>
          <li>
            <strong>Wesley Underwood</strong> - Database Developer
          </li>
        </ul>
      </div>
    </div>
  );
}
