import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { AiFillPrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { HTTP } from "../HTTPS";
import Swal from "sweetalert2";
import { useAuth } from "./auth";
import { Col, Row } from "react-bootstrap";
import { Select, Space, Spin, Table } from "antd";
import { CSVLink } from "react-csv";
import moment from "moment";
import logo from "../assets/imgs/logo.png";

import csvIcon from "../assets/imgs/csv.png";

const AllProductsReport = () => {
  const { t } = useTranslation();
  const currentLanguageCode = Cookies.get("i18next") || "en";
  const componentRef = useRef();
  const [date, setDate] = useState(moment().format("Y-MM-DD"));
  const auth = useAuth();

  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  const options = [
    { key: "all", value: "All" },
    { key: "total", value: "Total" },
  ];
  const printPage = useReactToPrint({
    content: () => componentRef.current,
  });
  const headers = [
    { label: `${t("name")}`, key: "name" },
    { label: `${t("type")}`, key: "type" },
    { label: `${t("quality")}`, key: "quality" },
    { label: `${t("line")}`, key: "line" },
    { label: `${t("s_packet_qnt")}`, key: "standartPacketQnt" },
    { label: `${t("packet_qnt")}`, key: "packetQnt" },
    { label: `${t("packet_w")}`, key: "packetWeight" },
  ];

  const allDataColumns = [
    {
      title: "#",
      width: 15,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("name")}`,
      dataIndex: "name",
      key: "id",
      width: 50,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "id",
      width: 50,
    },
    {
      title: `${t("quality")}`,
      dataIndex: "quality",
      key: "id",
      width: 30,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "id",
      width: 30,
    },
    {
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "id",
      width: 100,
    },
    {
      title: `${t("packet_qnt")}`,
      dataIndex: "packetQnt",
      key: "id",
      width: 50,
    },
    {
      title: `${t("packet_w")}`,
      dataIndex: "packetWeight",
      key: "id",
      width: 50,
    },
  ];

  const getAllDatas = async () => {
    setLoading(true);
    await HTTP.get(`/production/allproducts?_type=${type}`)
      .then((response) => {
        setAllData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
    getAllDatas();
  }, [type]);

  return (
    <>
      <Row className="mb-3">
        <Col md={2}>
          <Button
            variant="outlined"
            onClick={() => {
              printPage();
            }}
          >
            <span className={currentLanguageCode == "en" ? "en-f" : "kr-f"}>
              <AiFillPrinter /> {t("print")}
            </span>
          </Button>
        </Col>
        <Col md={2} className="d-flex align-items-center">
          <CSVLink
            className="csv-btn"
            data={allData}
            headers={headers}
            filename={`allProductions-${type}-${date}`}
          >
            <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
            .csv
          </CSVLink>
        </Col>
        <Col md={2}>
          <Select
            value={type}
            options={options}
            style={{ width: "100%" }}
            onChange={(e) => {
              setType(e);
            }}
          />
        </Col>
      </Row>
      <div
        ref={componentRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        className={currentLanguageCode == "en" ? "ltr" : "rtl"}
      >
        <img alt={""} src={logo} className={"watermark"} />
        <Row className="mx-md-3">
          <div className="forOrder d-flex flex-wrap justify-content-center py-2">
            <div className="">{t("for_order")}:</div>
            <div className="px-1">
              07509080800 - 07704867700 -07734456622 - 07508281666
            </div>
          </div>
        </Row>
        <Row className="px-md-3">
          {allData && (
            <Table
              loading={{
                indicator: (
                  <Space size="middle">
                    <Spin size="large" />
                  </Space>
                ),
                spinning: loading,
              }}
              size="small"
              rowKey="id"
              className="tbs-report"
              pagination={false}
              columns={allDataColumns}
              dataSource={allData}
            />
          )}
        </Row>
      </div>
    </>
  );
};

export default AllProductsReport;
