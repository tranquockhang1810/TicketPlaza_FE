import { DeleteOutlined, EditOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { isCheckinDate } from "./DateFormatter";

export function CurrencyDisplay (value) {
  let stringValue = `${value}`;
  let formattedIntegerPart = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedIntegerPart}`;
};

export function convertStringToNumber(value) {
  if (!isNaN(value)) {
    return Number(value);
  }
  const numberString = value.replace(/,/g, '');
  const number = parseInt(numberString, 10); 
  return number;
}

export function colorTextDisplay (value, color) {
  return <div style={{color: color, fontWeight: "bold"}}>{value}</div>;
}

export function IndexDisplay (currentPage, limit, index, item, record) {
  const currentIndex = (currentPage - 1) * limit + index + 1;
  return <span style={{ fontWeight: "bold" }}>{currentIndex}</span>;
}

export function RenderAction (Detail, Delete, item, Checkin) {
  const router = useRouter();
  const path = usePathname();
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
      {Delete && (
        <Button
          shape="round"
          type="text"
          style={{ color: "red" }}
          icon={<DeleteOutlined/>}
          onClick={() => Delete(item)}
        >
          Xóa
        </Button>
      )}
      {Checkin && (
        <Button
          shape="round"
          type="text"
          style={{ color: "green" }}
          icon={<QrcodeOutlined />}
          onClick={() => Checkin(item)}
        >
          Check-in
        </Button>
      )}
    </div>
  );
}

export function getItemWithColor (list, value, record) {
  let item = list.find(item => item.value === value);
  if (record && isCheckinDate(record)) {
    
  }
  return item ? { title: item.label, color: item.color } : { title: '', color: '' };
}

export function getLabelByValue (list, value) {
  return list.find(item => item.value === value)?.label;
}