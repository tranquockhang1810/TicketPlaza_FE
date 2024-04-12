'use client'
import {useState} from 'react'
import { Modal, Tabs } from "antd";
import { AppstoreOutlined, TagOutlined, TeamOutlined, MessageOutlined} from '@ant-design/icons'
import Tab01 from "./Tab01";

const CreateModal = ({
  showModal,
  setShowModal,
  getEvents,
  typeList
}) => {

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      destroyOnClose
      title={<span className="text-xl font-bold">Thêm sự kiện mới</span>}
      onCancel={() => setShowModal(false)}
      footer={null}
    >
      <Tab01 
        getEvents={getEvents}
        setShowModal={setShowModal}
        showModal={showModal}
        typeList={typeList}
        forCreate={true}
      />
    </Modal>
  );
};

export default CreateModal;
