import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>
        home
      </h1>
      <Link to='/register' className="bg-gray-500">register </Link>
      <Link to='/login' className="bg-yellow-500">login</Link>
      <Link to='/profile' className="bg-green-500">profile</Link>
    </>
  );
}

export default Home;