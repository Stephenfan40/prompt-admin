import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const PromptAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  console.log('API URL:', apiUrl);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();


  useEffect(() => {
    axios
      .get(`${apiUrl}/api/prompt`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [apiUrl]); // 添加 apiUrl 到依赖项数组
  
  //表格列以匹配返回的数据：
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '图片 URL',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '注意事项',
      dataIndex: 'attention_note',
      key: 'attention_note',
    },
    {
      title: '示例问题',
      dataIndex: 'example_question',
      key: 'example_question',
    },
    {
      title: '示例答案',
      dataIndex: 'example_answer',
      key: 'example_answer',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            删除
          </Button>
        </>
      ),
    },
  ];
  
  //处理添加、编辑和删除操作的函数（无变化）
  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`${apiUrl}/api/prompt/${id}`)
      .then(() => {
        message.success('删除成功');
        setData(data.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
        message.error('删除失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
  
      const { id } = selectedRecord || {};
      const apiMethod = id ? axios.put : axios.post;
      const apiUrlWithId = id ? `${apiUrl}/api/prompt/${id}` : `${apiUrl}/api/prompt`;
      apiMethod(apiUrlWithId, values)
        .then(({ data: updatedData }) => {
          if (id) {
            setData(data.map((item) => (item.id === id ? updatedData : item)));
          } else {
            setData([...data, updatedData]);
          }
          setModalVisible(false);
          message.success('保存成功');
        })
        .catch((error) => {
          console.error('Error saving data:', error);
          message.error('保存失败');
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };
  

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        添加
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title={selectedRecord ? '编辑数据' : '添加数据'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="图片 URL"
            rules={[{ required: true, message: '请输入图片 URL' }]}
          >
            <Input placeholder="请输入图片 URL" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请输入类型' }]}
          >
            <Input placeholder="请输入类型" />
          </Form.Item>
          <Form.Item
            name="attention_note"
            label="注意事项"
            rules={[{ required: true, message: '请输入注意事项' }]}
          >
            <Input placeholder="请输入注意事项" />
          </Form.Item>
          <Form.Item
            name="example_question"
            label="示例问题"
            rules={[{ required: true, message: '请输入示例问题' }]}
          >
            <Input placeholder="请输入示例问题" />
          </Form.Item>
          <Form.Item
            name="example_answer"
            label="示例答案"
            rules={[{ required: true, message: '请输入示例答案' }]}
          >
            <Input placeholder="请输入示例答案" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromptAdmin;
