import { Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const Productions = ({ date, year, url, line, setCsvData, setHeaders }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [production, setProduction] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  const productColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("name")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{record.packetQnt ? <>{record.name}</> : <></>}</span>
      ),
    },
    {
      title: `${t("type")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{record.packetQnt ? <>{record.type}</> : <></>}</span>
      ),
    },
    {
      title: `${t("quality")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.packetQnt ? <>{record.quality}</> : <></>}</span>
      ),
    },
    {
      title: `${t("line")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.packetQnt ? <>{record.line}</> : <></>}</span>
      ),
    },
    {
      title: `${t("s_packet_qnt")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>
          {record.packetQnt ? <>{record.standartPacketQnt}</> : <></>}
        </span>
      ),
    },
    {
      title: `${t("packet_qnt")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>
          {record.packetQnt ? (
            <>
              {record.packetQnt} {t("kg")}
            </>
          ) : (
            <div className="bg-danger text-white px-2">
              {record.tpacketQnt} {t("kg")}
            </div>
          )}
        </span>
      ),
    },
    {
      title: `${t("packet_w")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>
          {record.packetQnt ? (
            <>
              {record.packetWeight} {t("kg")}
            </>
          ) : (
            <div className="bg-danger text-white px-2">
              {record.tpacketWeight} {t("kg")}
            </div>
          )}
        </span>
      ),
    },
  ];

  const getTotal = async () => {
    if (url == "production") {
      if (!date) {
        if (!year) {
          date = moment().format("Y-MM-DD");
        }
      }
    }
    setLoading(true);
    await HTTP.get(`/${url}/grouped?_line=${line}&_date=${date}&_year=${year}`)
      .then((response) => {
        setTotal(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTotal([]);
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
  const getProductions = async () => {
    if (url == "production") {
      if (!date) {
        if (!year) {
          date = moment().format("Y-MM-DD");
        }
      }
    }
    setLoading(true);
    await HTTP.get(
      `/${url}/allreport?_line=${line}&_date=${date}&_year=${year}`
    )
      .then((response) => {
        setProduction(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setProduction([]);
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
      { label: `${t("name")}`, key: "name" },
      { label: `${t("type")}`, key: "type" },
      { label: `${t("quality")}`, key: "quality" },
      { label: `${t("line")}`, key: "line" },
      { label: `${t("s_packet_qnt")}`, key: "standartPacketQnt" },
      { label: `${t("packet_qnt")}`, key: "packetQnt" },
      { label: `${t("total")}`, key: "tpacketQnt" },
      { label: `${t("packet_w")}`, key: "packetWeight" },
      { label: `${t("total")}`, key: "tpacketWeight" },
    ]);
    getProductions();
    getTotal();
  }, [date, year, line]);
  useEffect(() => {
    var d = [];
    production.map((product, index) => {
      if (
        production.length !== index + 1 &&
        production[index].name === production[index + 1]?.name &&
        production[index].type === production[index + 1].type &&
        production[index].quality === production[index + 1].quality &&
        production[index].line === production[index + 1].line
      ) {
        d.push(product);
      } else if (production.length === index + 1) {
        d.push(product);
        total.map((t) => {
          if (
            t.name == product.name &&
            t.type == product.type &&
            t.quality == product.quality &&
            t.line == product.line
          ) {
            d.push({
              tpacketWeight: t.packetWeight,
              tpacketQnt: t.packetQnt,
            });
          }
        });
      } else {
        d.push(product);
        total.map((t) => {
          if (
            t.name == product.name &&
            t.type == product.type &&
            t.quality == product.quality &&
            t.line == product.line
          ) {
            d.push({
              tpacketWeight: t.packetWeight,
              tpacketQnt: t.packetQnt,
            });
          }
        });
      }
    });
    setAllData(d);
  }, [production, total]);

  useEffect(() => {
    setCsvData(allData);
  }, [allData]);
  return (
    <>
      <div className="">
        {t("total")} ({production.length})
      </div>
      <Table
        columns={productColumn}
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

export default Productions;
