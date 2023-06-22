import Note from "./Note"
const Home = (props) => {

  return (
    <div>
      <Note showAlert={props.showAlert} />
    </div>

  )
};
export default Home;
