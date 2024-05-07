'use client'
import {useState} from 'react'
import { Modal, Tabs } from "antd";
import { AppstoreOutlined, TagOutlined, TeamOutlined, MessageOutlined} from '@ant-design/icons'
import Tab01 from "./Tab01";
import Tab02 from './Tab02';
import Tab03 from './Tab03';
import Tab04 from './Tab04';

const { TabPane } = Tabs;

const EventModal = ({
  record,
  showModal,
  setShowModal,
  getEvents,
  statusList,
  typeList
}) => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

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
      <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handleTabChange} indicator={{align: 'center'}} >
        <TabPane tab="Thông tin sự kiện" key="1" icon={<AppstoreOutlined/>}>
          <Tab01 
            record={record}
            getEvents={getEvents}
            setShowModal={setShowModal}
            showModal={showModal}
            statusList={statusList}
            typeList={typeList}
            forCreate={false}
          />
        </TabPane>
        <TabPane tab="Vé" key="2" icon={<TagOutlined/>}>
          <Tab02
            record={record}
            showModal={showModal}
          />
        </TabPane>
        <TabPane tab="Thành viên" key="3" icon={<TeamOutlined />}>
          <Tab03
            record={record}
            showModal={showModal}
            getEvents={getEvents}
          />
        </TabPane>
        <TabPane tab="Phản hồi" key="4" icon={<MessageOutlined />}>
          <Tab04
            event={record}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default EventModal;
