import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function CurrencyDisplay (text) {
  return <span>{`${new Intl.NumberFormat().format(text)} VNĐ`}</span>;
}

export function colorTextDisplay (value, color) {
  return <div style={{color: color, fontWeight: "bold"}}>{value}</div>;
}

export function IndexDisplay (currentPage, limit, index, item, record) {
  const currentIndex = (currentPage - 1) * limit + index + 1;
  return <span style={{ fontWeight: "bold" }}>{currentIndex}</span>;
}

export function RenderAction (Detail, Delete, item) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1%",
        justifyContent: "center"
      }}
    >
      <Button
        shape="round"
        type="text"
        style={{ color: "purple" }}
        icon={<EditOutlined/>}
        onClick={() => Detail(item)}
      >
        Chi tiết
      </Button>
      <Button
        title="Xóa"
        shape="round"
        type="text"
        style={{ color: "red" }}
        icon={<DeleteOutlined/>}
        onClick={() => Delete(item)}
      >
        Xóa
      </Button>
    </div>
  );
}

export function getItemWithColor (list, value) {
  const item = list.find(item => item.value === value);
  return item ? { title: item.label, color: item.color } : { title: '', color: '' };
}

export function getLabelByValue (list, value) {
  return list.find(item => item.value === value)?.label;
}