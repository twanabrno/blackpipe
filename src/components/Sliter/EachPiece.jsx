import { Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const EachPiece = ({ rollId, date }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [piecesData, setPiecesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const eachPiece = [
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "id",
      width: 60,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
    {
      title: `${t("code")}`,
      dataIndex: "autoCode",
      key: "id",
      width: 60,
    },
    {
      title: `${t("comment")}`,
      dataIndex: "pieceComment",
      key: "id",
      width: 90,
    },
    {
      title: `${t("date")}`,
      key: "id",
      width: 25,
      render: (record) => (
        <span>{moment(record.createdAt).format("Y.MM.DD HH:mm")}</span>
      ),
    },
  ];

  const getPieces = async () => {
    setLoading(true);
    await HTTP.get(`/pieces/all?_rollId=${rollId}&_deleted=${true}`)
      .then((response) => {
        setLoading(false);
        setPiecesData(response.data.rows);
      })
      .catch((error) => {
        setLoading(false);
        setPiecesData([]);
        if (error.response.status == 401) {
          auth.logout();
        } else if (error.response.status === 404) {
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
    getPieces();
  }, []);

  return (
    <>
      {!loading ? (
        <Table
          size="small"
          className="m-md-3 mb-4"
          // tableLayout="fixed"
          columns={eachPiece}
          dataSource={piecesData}
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
        />
      ) : (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      )}
    </>
  );
};

export default EachPiece;
