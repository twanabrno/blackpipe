import { Space, Spin, Table } from "antd";
import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { HTTP } from "../../HTTPS";
import { useAuth } from "../auth";

const Tamburs = ({ date, year, line, csv, setCsvData, setHeaders }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [tamburs, setTamburs] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  const tamburColumn = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("thikness")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.weight ? <>{record.thikness}</> : <></>}</span>
      ),
    },
    {
      title: `${t("width")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.weight ? <>{record.width}</> : <></>}</span>
      ),
    },
    {
      title: `${t("type")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.weight ? <>{record.type}</> : <></>}</span>
      ),
    },
    {
      title: `${t("line")}`,
      key: "id",
      width: 35,
      render: (record) => (
        <span>{record.weight ? <>{record.line}</> : <></>}</span>
      ),
    },
    {
      title: `${t("code")}`,
      key: "id",
      width: 75,
      render: (record) => (
        <span>{record.weight ? <>{record.autoCode}</> : <></>}</span>
      ),
    },
    {
      title: `${t("weight")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>
          {record.weight ? (
            <>
              {record.weight} {t("kg")}
            </>
          ) : (
            <div className="bg-danger text-white px-2">
              {record.total_weight} {t("kg")}
            </div>
          )}
        </span>
      ),
    },
    {
      title: `${t("realWeight")}`,
      key: "id",
      width: 50,
      render: (record) => (
        <span>
          {record.weight ? (
            <>
              {record.realWeight} {t("kg")}
            </>
          ) : (
            <div className="bg-danger text-white px-2">
              {record.total_real_weight} {t("kg")}
            </div>
          )}
        </span>
      ),
    },
  ];

  const getTotal = async () => {
    setLoading(true);
    if (!date) {
      if (!year) {
        date = moment().format("Y-MM-DD");
      }
    }
    await HTTP.get(`/tambur/grouped?&_date=${date}&_year=${year}&_line=${line}`)
      .then((response) => {
        setTotal(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTotal([]);
        if (error.response.status == 401 || error.response.status == 403) {
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
  const getTamburs = async () => {
    if (!date) {
      if (!year) {
        date = moment().format("Y-MM-DD");
      }
    }
    setLoading(true);
    await HTTP.get(
      `/tambur/allreport?_order=date&_date=${date}&_year=${year}&_line=${line}`
    )
      .then((response) => {
        setTamburs(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setTamburs([]);
        if (error.response.status == 401 || error.response.status == 403) {
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
    if (csv) {
      setHeaders([
        { label: `${t("thikness")}`, key: "thikness" },
        { label: `${t("width")}`, key: "width" },
        { label: `${t("type")}`, key: "type" },
        { label: `${t("line")}`, key: "line" },
        { label: `${t("code")}`, key: "autoCode" },
        { label: `${t("weight")}`, key: "weight" },
        { label: `${t("total_weight")}`, key: "total_weight" },
        { label: `${t("realWeight")}`, key: "realWeight" },
        { label: `${t("total_real_weight")}`, key: "total_real_weight" },
      ]);
    }
    getTamburs();
    getTotal();
  }, [date, year, line]);
  useEffect(() => {
    var d = [];
    tamburs.map((tambur, index) => {
      if (
        tamburs.length !== index + 1 &&
        tamburs[index].thikness === tamburs[index + 1]?.thikness &&
        tamburs[index].width === tamburs[index + 1].width &&
        tamburs[index].type === tamburs[index + 1].type &&
        tamburs[index].rollQuality === tamburs[index + 1].rollQuality
      ) {
        d.push(tambur);
      } else if (tamburs.length === index + 1) {
        d.push(tambur);
        total.map((t) => {
          if (
            t.thikness == tambur.thikness &&
            t.type == tambur.type &&
            t.width == tambur.width &&
            t.rollQuality == tambur.rollQuality
          ) {
            d.push({
              total_weight: t.total_weight,
              total_real_weight: t.total_real_weight,
            });
          }
        });
      } else {
        d.push(tambur);
        total.map((t) => {
          if (
            t.thikness == tambur.thikness &&
            t.type == tambur.type &&
            t.width == tambur.width &&
            t.rollQuality == tambur.rollQuality
          ) {
            d.push({
              total_weight: t.total_weight,
              total_real_weight: t.total_real_weight,
            });
          }
        });
      }
    });
    setAllData(d);
  }, [tamburs, total]);

  useEffect(() => {
    if (csv) {
      setCsvData(allData);
    }
  }, [allData]);
  return (
    <>
      <div className="">
        {t("total")} ({tamburs.length})
      </div>
      <Table
        columns={tamburColumn}
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

export default Tamburs;
