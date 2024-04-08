'use client'
import { Modal, Tabs } from "antd";
import { AppstoreOutlined, TagOutlined, TeamOutlined} from '@ant-design/icons'
import Tab01 from "./Tab01";

const { TabPane } = Tabs;

const EventModal = ({
  record,
  showModal,
  setShowModal,
  getEvents,
  statusList,
  typeList
}) => {

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      destroyOnClose
      title={<span className="text-xl font-bold">Thông tin chi tiết</span>}
      onCancel={() => setShowModal(false)}
      footer={null}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin sự kiện" key="1" icon={<AppstoreOutlined/>}>
          <Tab01 
            record={record}
            getEvents={getEvents}
            setShowModal={setShowModal}
            showModal={showModal}
            statusList={statusList}
            typeList={typeList}
          />
        </TabPane>
        <TabPane tab="Vé" key="2" icon={<TagOutlined/>}>
          {/* Thêm nội dung cho tab thứ 2 nếu cần */}
        </TabPane>
        <TabPane tab="Thành viên" key="3" icon={<TeamOutlined />}>
          {/* Thêm nội dung cho tab thứ 2 nếu cần */}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EventModal;
