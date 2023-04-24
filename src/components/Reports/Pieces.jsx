import { Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const Pieces = ({ year, date, setCsvData, setHeaders }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pieceColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "thikness",
      width: 35,
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "width",
      width: 35,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 35,
    },
    {
      title: `${t("rollQuality")}`,
      dataIndex: "rollQuality",
      key: "rollQuality",
      width: 35,
    },
    {
      title: `${t("code")}`,
      dataIndex: "autoCode",
      key: "autoCode",
      width: 50,
    },
    {
      title: `${t("weight")}`,
      dataIndex: "weight",
      key: "weight",
      width: 50,
    },
  ];

  const getPieces = async () => {
    if (!date) {
      if (!year) {
        date = moment().format("Y-MM-DD");
      }
    }
    setLoading(true);
    await HTTP.get(`/pieces/allreport?_date=${date}&_year=${year}`)
      .then((response) => {
        setAllData(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setAllData([]);
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
    setHeaders([
      { label: `${t("thikness")}`, key: "thikness" },
      { label: `${t("width")}`, key: "width" },
      { label: `${t("type")}`, key: "type" },
      { label: `${t("rollQuality")}`, key: "rollQuality" },
      { label: `${t("code")}`, key: "autoCode" },
      { label: `${t("weight")}`, key: "weight" },
    ]);
    getPieces();
  }, [date, year]);
  useEffect(() => {
    setCsvData(allData);
  }, [allData]);
  return (
    <>
    <div className="">{t("total")} ({allData.length})</div>
      <Table
        columns={pieceColumn}
        size="small"
        className="tbs-report"
        id="rollsTable"
        tableLayout="fixed"
        rowKey="id"
        loading={{
          indicator: (
            <Space size="middle">
              <Spin size="large" />
            </Space>
          ),
          spinning: loading,
        }}
        pagination={false}
        dataSource={allData}
      />
    </>
  );
};

export default Pieces;
