import "./input.scss";

const Input = ({ onChange }) => {
  return (
    <input
      name="search"
      className="search-box"
      placeholder="Search by blog title"
      onChange={onChange}
    />
  );
};

export default Input;
