import FileInput from "./FileInput";
import Input from "./Input";
import SelectInput from "./SelectInput";
import Textarea from "./Textarea";

const FormikController = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "select":
      return <SelectInput {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case "file":
      return <FileInput {...rest}/>;
    // case "checkbox":
    // case "date":
    default:
      return null;
  }
};
export default FormikController;
