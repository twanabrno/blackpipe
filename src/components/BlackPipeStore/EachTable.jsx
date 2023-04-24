import { Button, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HTTP } from "../../HTTPS";
import { AiTwotoneEdit } from "react-icons/ai";
import moment from "moment/moment";
import { useAuth } from "../auth";
import Swal from "sweetalert2";

const EachTable = ({
  record,
  handleAddSelectedRows,
  handleRemoveSelectedRows,
  handleUpdateRecord,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const [eachData, setEachData] = useState([]);
  const [loading, setLoading] = useState(false);

  const bStoreColumns = [
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      key: "packetQnt",
      width: 35,
      render: (record) => (
        <span>
          {Number(record.packetQnt) < Number(record.standartPacketQnt) ? (
            <div className="bg_tarqeq">
              {record.packetQnt} {t("pipes")}
            </div>
          ) : (
            <div>
              {record.packetQnt} {t("pipes")}
            </div>
          )}
        </span>
      ),
    },
    {
      title: `${t("weight")}`,
      dataIndex: "packetWeight",
      key: "packetWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("code")}`,
      dataIndex: "productCode",
      key: "productCode",
      width: 50,
    },
    {
      title: `${t("from")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <>{record.seller ? <>{record.seller}</> : <>{record.from}</>}</>
      ),
    },
    {
      title: `${t("date")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{moment(record.createdAt).format("Y.MM.DD HH:mm")}</span>
      ),
    },
    {
      dataIndex: "",
      width: 100,
      fixed: "right",
      key: "id",
      className: `${
        role == "Admin" || role == "Accountant" || role == "Sliter"
          ? ""
          : "d-none"
      }`,
      render: (record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              handleUpdateRecord(record);
            }}
            type="primary"
            ghost
          >
            <AiTwotoneEdit />{" "}
            <span className="d-none d-md-inline"> {t("edit")}</span>
          </Button>
        </>
      ),
    },
  ];

  const rowSelection = {
    onSelect: (record, selected) => {
      if (selected) {
        handleAddSelectedRows(record.id);
      } else if (!selected) {
        handleRemoveSelectedRows(record.id);
      }
    },
  };
  const getEach = async () => {
    setLoading(true);
    await HTTP.get(
      `/blackpistore/each?_name=${record.name}&_type=${record.type}&_line=${record.line}&_quality=${record.quality}`
    )
      .then((response) => {
        setLoading(false);
        setEachData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        setEachData([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: `${t("Data_Not_Found")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else alert("Somthing is wrong, Please try again later");
      });
  };
  useEffect(() => {
    getEach();
  }, []);

  return (
    <div className="px-5">
      <Table
        columns={bStoreColumns}
        rowSelection={{
          type: "checkbox",
          hideSelectAll: true,
          ...rowSelection,
          getCheckboxProps: () => ({
            className: `${
              role == "Admin" || role == "Accountant" || role == "Sliter"
                ? ""
                : "d-none"
            }`,
          }),
        }}
        size="small"
        className="tbss"
        id="rollsTable"
        rowKey="id"
        pagination={false}
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: loading,
        }}
        dataSource={eachData}
      />
    </div>
  );
};

export default EachTable;
