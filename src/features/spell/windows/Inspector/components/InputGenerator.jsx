import { useState, useEffect } from "react";

const SingleInput = (props) => {
  return (
    <div style={{ marginBottom: 10, flex: 1, width: "100%" }}>
      <p style={{ display: "inline" }}>{props.name}</p>
      <span style={{ float: "right" }}>
        <button className="list" onClick={() => props.delete(props.name)}>
          Delete
        </button>
      </span>
    </div>
  );
};

const AddNewInput = (props) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onAdd = () => {
    props.addOutput(value);
    setValue("");
  };

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <input
        style={{ flex: 6, padding: 0 }}
        value={value}
        type="text"
        onChange={onChange}
      />
      <button style={{ flex: 1 }} onClick={onAdd}>
        Add
      </button>
    </div>
  );
};

const InputGenerator = ({ updateData, control, initialValue, ...props }) => {
  const [inputs, setInputs] = useState([...initialValue]);
  const { controls, dataKey } = control;

  useEffect(() => {
    if (!initialValue) return;
    const newInputs = initialValue.filter(
      (input) =>
        !control.controls.data.ignored.some(
          (ignored) => ignored.name === input.name
        )
    );
    setInputs(newInputs);
  }, [initialValue]);

  const onDelete = (name) => {
    const newInputs = inputs.filter((input) => input.name !== name);
    setInputs(newInputs);
    update(newInputs);
  };

  const update = (update) => {
    updateData({ [dataKey]: [...update, ...control.controls.data.ignored] });
  };

  const addOutput = (input) => {
    const newOutput = {
      name: input,
      socketType: controls.data.socketType,
    };

    const newOutputs = [...inputs, newOutput];
    setInputs(newOutputs);
    update(newOutputs);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {inputs.map((input, i) => (
        <SingleInput name={input.name} key={i} delete={onDelete} />
      ))}
      <AddNewInput addOutput={addOutput} />
    </div>
  );
};

export default InputGenerator;
