import React, {useState} from "react";
import {Button, Input, Space, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";

const ProjectNameEditor: React.FC<{ projectName: string; setProjectName: (name: string) => void }> = ({ projectName, setProjectName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(projectName);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setProjectName(editValue);
        setIsEditing(false);
    };

    return (
        <Space>
            {isEditing ? (
                <>
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onPressEnter={handleSave}
                        style={{ width: 120 }}
                    />
                    <Button onClick={handleSave} size="small">
                        Save
                    </Button>
                </>
            ) : (
                <>
                    <Tag color="blue">Project: {projectName}</Tag>
                    <Button icon={<EditOutlined />} onClick={handleEdit} size="small" />
                </>
            )}
        </Space>
    );
};

export default ProjectNameEditor;