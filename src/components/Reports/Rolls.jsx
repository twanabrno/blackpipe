import { Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const Rolls = ({ date, year, setCsvData, setHeaders }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [rolls, setRolls] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  const rollColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("code")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{record.netWeight ? <>{record.code}</> : <></>}</span>
      ),
    },
    {
      title: `${t("thikness")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{record.netWeight ? <>{record.thikness}</> : <></>}</span>
      ),
    },
    {
      title: `${t("width")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>{record.netWeight ? <>{record.width}</> : <></>}</span>
      ),
    },
    {
      title: `${t("type")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.netWeight ? <>{record.type}</> : <></>}</span>
      ),
    },
    {
      title: `${t("rollQuality")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.netWeight ? <>{record.rollQuality}</> : <></>}</span>
      ),
    },
    {
      title: `${t("weight")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>
          {record.netWeight ? (
            <>
              {record.netWeight} {t("kg")}
            </>
          ) : (
            <div className="bg-danger text-white px-2">
              {record.total_weight} {t("kg")}
            </div>
          )}
        </span>
      ),
    },
  ];

  const getTotal = async () => {
    setLoading(true);
    await HTTP.get(`/rolls/grouped?_date=${date}&_year=${year}`)
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
  const getRolls = async () => {
    setLoading(true);
    await HTTP.get(`/rolls/allreport?_date=${date}&_year=${year}`)
      .then((response) => {
        setRolls(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setRolls([]);
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
      { label: `${t("weight")}`, key: "netWeight" },
      { label: `${t("total_weight")}`, key: "total_weight" },
    ]);
    getRolls();
    getTotal();
  }, [date, year]);
  useEffect(() => {
    var d = [];
    rolls.map((roll, index) => {
      if (
        rolls.length !== index + 1 &&
        rolls[index].thikness === rolls[index + 1]?.thikness &&
        rolls[index].width === rolls[index + 1].width &&
        rolls[index].type === rolls[index + 1].type &&
        rolls[index].rollQuality === rolls[index + 1].rollQuality
      ) {
        d.push(roll);
      } else if (rolls.length === index + 1) {
        d.push(roll);
        total.map((t) => {
          if (
            t.thikness == roll.thikness &&
            t.type == roll.type &&
            t.width == roll.width &&
            t.rollQuality == roll.rollQuality
          ) {
            d.push({ total_weight: t.total_weight });
          }
        });
      } else {
        d.push(roll);
        total.map((t) => {
          if (
            t.thikness == roll.thikness &&
            t.type == roll.type &&
            t.width == roll.width &&
            t.rollQuality == roll.rollQuality
          ) {
            d.push({ total_weight: t.total_weight });
          }
        });
      }
    });
    setAllData(d);
  }, [rolls, total]);

  useEffect(() => {
    setCsvData(allData);
  }, [allData]);

  return (
    <>
      <div className="">
        {t("total")} ({rolls.length})
      </div>
      <Table
        columns={rollColumn}
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

export default Rolls;
