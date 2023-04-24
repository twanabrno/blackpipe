import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { HTTP } from "../HTTPS";
import { useTranslation } from "react-i18next";
import { Space, Spin, Table, Input, DatePicker } from "antd";
import Cookies from "js-cookie";
import { useAuth } from "./auth";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import moment from "moment/moment";
import csvIcon from "../assets/imgs/csv.png";
const { Search } = Input;

const Dashboard = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const currentLanguageCode = Cookies.get("i18next") || "en";
  const [date, setDate] = useState(moment().format("Y-MM-DD"));
  const [key, setKey] = useState("rolls");

  const [rollData, setRollData] = useState([]);
  const [rsearch, setRSearch] = useState("");
  const [rloading, setRLoading] = useState(false);
  const [rdate, setRDate] = useState("");

  const [piecesData, setPiecesData] = useState([]);
  const [psearch, setPSearch] = useState("");
  const [ploading, setPLoading] = useState(false);
  const [pdate, setPDate] = useState("");

  const [tambursData, setTambursData] = useState([]);
  const [tsearch, setTSearch] = useState("");
  const [tloading, setTLoading] = useState(false);
  const [tdate, setTDate] = useState("");

  const [productionData, setProductionData] = useState([]);
  const [fsearch, setFSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [fdate, setFDate] = useState("");

  const [bStoreData, setBStoreData] = useState([]);
  const [bsearch, setBSearch] = useState("");
  const [bloading, setBLoading] = useState(false);
  const [bdate, setBDate] = useState("");

  const [qStoreData, setQStoreData] = useState([]);
  const [qsearch, setQSearch] = useState("");
  const [qloading, setQLoading] = useState(false);
  const [qdate, setQDate] = useState("");

  const rollheaders = [
    { label: `${t("thikness")}`, key: "thikness" },
    { label: `${t("width")}`, key: "width" },
    { label: `${t("type")}`, key: "type" },
    { label: `${t("rollQuality")}`, key: "rollQuality" },
    { label: `${t("total_weight")}`, key: "total_weight" },
  ];
  const tamburheaders = [
    { label: `${t("thikness")}`, key: "thikness" },
    { label: `${t("width")}`, key: "width" },
    { label: `${t("type")}`, key: "type" },
    { label: `${t("total_weight")}`, key: "total_weight" },
  ];
  const storeheaders = [
    { label: `${t("list_name")}`, key: "name" },
    { label: `${t("qnt")}`, key: "packetQnt" },
    { label: `${t("weight")}`, key: "packetWeight" },
    { label: `${t("quality")}`, key: "quality" },
    { label: `${t("type")}`, key: "type" },
    { label: `${t("line")}`, key: "line" },
    { label: `${t("s_packet_qnt")}`, key: "standartPacketQnt" },
    { label: `${t("s_packet_w")}`, key: "standartPacketWeight" },
  ];

  const ProductionColumn = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "packetQnt",
      key: "packetQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
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
      title: `${t("quality")}`,
      dataIndex: "quality",
      key: "quality",
      width: 75,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 35,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 35,
    },
    {
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "standartPacketQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
        </span>
      ),
    },
    {
      title: `${t("s_packet_w")}`,
      dataIndex: "standartPacketWeight",
      key: "standartPacketWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];
  const RollColumns = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "id",
      width: 75,
    },
    {
      title: `${t("rollQuality")}`,
      dataIndex: "rollQuality",
      key: "id",
      width: 50,
    },
    {
      title: `${t("total_weight")}`,
      dataIndex: "total_weight",
      key: "thikness",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];
  const PiecesColumns = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "id",
      width: 75,
    },
    {
      title: `${t("rollQuality")}`,
      dataIndex: "rollQuality",
      key: "id",
      width: 50,
    },
    {
      title: `${t("total_weight")}`,
      dataIndex: "total_weight",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record.toFixed(3)} {t("kg")}
        </span>
      ),
    },
  ];
  const TambursColumns = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("thikness")}`,
      dataIndex: "thikness",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("width")}`,
      dataIndex: "width",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("mm")}
        </span>
      ),
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "id",
      width: 75,
    },
    {
      title: `${t("total_weight")}`,
      dataIndex: "total_weight",
      key: "id",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];
  const bStoreColumns = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "packetQnt",
      key: "packetQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
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
      title: `${t("quality")}`,
      dataIndex: "quality",
      key: "quality",
      width: 75,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 35,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 35,
    },
    {
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "standartPacketQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
        </span>
      ),
    },
    {
      title: `${t("s_packet_w")}`,
      dataIndex: "standartPacketWeight",
      key: "standartPacketWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];
  const qStoreColumns = [
    {
      title: "#",
      width: 10,
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: `${t("list_name")}`,
      dataIndex: "name",
      key: "name",
      width: 75,
    },
    {
      title: `${t("qnt")}`,
      dataIndex: "packetQnt",
      key: "packetQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
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
      title: `${t("quality")}`,
      dataIndex: "quality",
      key: "quality",
      width: 75,
    },
    {
      title: `${t("type")}`,
      dataIndex: "type",
      key: "type",
      width: 35,
    },
    {
      title: `${t("line")}`,
      dataIndex: "line",
      key: "line",
      width: 35,
    },
    {
      title: `${t("s_packet_qnt")}`,
      dataIndex: "standartPacketQnt",
      key: "standartPacketQnt",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("pipes")}
        </span>
      ),
    },
    {
      title: `${t("s_packet_w")}`,
      dataIndex: "standartPacketWeight",
      key: "standartPacketWeight",
      width: 75,
      render: (record) => (
        <span>
          {record} {t("kg")}
        </span>
      ),
    },
  ];

  const getRollsData = async () => {
    setRLoading(true);
    await HTTP.get(`/rolls/grouped?_search=${rsearch}&_date=${rdate}`)
      .then((response) => {
        setRLoading(false);
        setRollData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        setRollData([]);
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
  const getPieces = async () => {
    setPLoading(true);
    await HTTP.get(`/pieces/grouped?_search=${psearch}&_date=${pdate}`)
      .then((response) => {
        setPLoading(false);
        setPiecesData(response.data);
      })
      .catch((error) => {
        setPLoading(false);
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
  const getTamburedsData = async () => {
    setTLoading(true);
    await HTTP.get(`/tambur/grouped?_search=${tsearch}&_date=${tdate}`)
      .then((response) => {
        setTLoading(false);
        setTambursData(response.data);
      })
      .catch((error) => {
        setTLoading(false);
        setTambursData([]);
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
  const getAllFDatas = async () => {
    setLoading(true);
    await HTTP.get(`/production/grouped?_search=${fsearch}&_date=${fdate}`)
      .then((response) => {
        setLoading(false);
        setProductionData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        setProductionData([]);
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
  const getAllBDatas = async () => {
    setBLoading(true);
    await HTTP.get(`/blackpistore/grouped?_search=${bsearch}&_date=${bdate}`)
      .then((response) => {
        setBLoading(false);
        setBStoreData(response.data);
      })
      .catch((error) => {
        setBLoading(false);
        setBStoreData([]);
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
  const getAllQDatas = async () => {
    setQLoading(true);
    await HTTP.get(
      `/qandelblbasstore/grouped?_search=${qsearch}&_date=${qdate}`
    )
      .then((response) => {
        setQLoading(false);
        setQStoreData(response.data);
      })
      .catch((error) => {
        setQLoading(false);
        setQStoreData([]);
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
    getAllFDatas();
    getRollsData();
    getPieces();
    getTamburedsData();
    getAllBDatas();
    getAllQDatas();
  }, [
    rsearch,
    rdate,
    psearch,
    pdate,
    tsearch,
    tdate,
    fsearch,
    fdate,
    bsearch,
    bdate,
    qsearch,
    qdate,
  ]);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className={currentLanguageCode == "en" ? "mb-3 tab-enf" : "mb-3 tab-kf"}
      justify
    >
      <Tab eventKey="rolls" title={`${t("current_rolls")}`}>
        <Row>
          <Col md={4}>
            <Search
              placeholder={t("search")}
              allowClear
              enterButton
              className="my-md-2"
              onChange={(e) => {
                setRSearch(e.target.value);
              }}
            />
          </Col>
          <Col md={2}>
            <DatePicker
              placeholder={t("date")}
              className="my-2"
              onChange={(date, dateString) => {
                setRDate(dateString);
              }}
            />
          </Col>
          <Col md={2} className=" py-2 d-flex align-items-center">
            <CSVLink
              className="csv-btn"
              data={rollData}
              headers={rollheaders}
              disabled={!rollData.length}
              filename={`rolls-dashboard(${date})`}
            >
              <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
              .csv
            </CSVLink>
          </Col>
        </Row>
        <Table
          columns={RollColumns}
          size="small"
          className="tbs"
          id="rollsTable"
          tableLayout="fixed"
          rowKey="id"
          loading={{
            indicator: (
              <Space size="middle">
                <Spin size="large" />
              </Space>
            ),
            spinning: rloading,
          }}
          pagination={false}
          dataSource={rollData}
        />
      </Tab>
      <Tab eventKey="pieces" title={`${t("current_pieces")}`}>
        <Row>
          <Col md={4}>
            <Search
              placeholder={t("search")}
              allowClear
              enterButton
              className="my-md-2"
              onChange={(e) => {
                setPSearch(e.target.value);
              }}
            />
          </Col>
          <Col md={2}>
            <DatePicker
              placeholder={t("date")}
              className="my-2"
              onChange={(date, dateString) => {
                setPDate(dateString);
              }}
            />
          </Col>
          <Col md={2} className=" py-2 d-flex align-items-center">
            <CSVLink
              className="csv-btn"
              data={piecesData}
              headers={rollheaders}
              disabled={!piecesData.length}
              filename={`pieces-dashboard(${date})`}
            >
              <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
              .csv
            </CSVLink>
          </Col>
        </Row>
        <Table
          columns={PiecesColumns}
          size="small"
          className="tbs"
          rowKey="id"
          loading={{
            indicator: (
              <Space size="middle">
                <Spin size="large" />
              </Space>
            ),
            spinning: ploading,
          }}
          pagination={false}
          dataSource={piecesData}
        />
      </Tab>
      <Tab eventKey="tamburs" title={`${t("current_tambured")}`}>
        <Row>
          <Col md={4}>
            <Search
              placeholder={t("search")}
              allowClear
              enterButton
              className="my-md-2"
              onChange={(e) => {
                setTSearch(e.target.value);
              }}
            />
          </Col>
          <Col md={2}>
            <DatePicker
              placeholder={t("date")}
              className="my-2"
              onChange={(date, dateString) => {
                setTDate(dateString);
              }}
            />
          </Col>
          <Col md={2} className=" py-2 d-flex align-items-center">
            <CSVLink
              className="csv-btn"
              data={tambursData}
              headers={tamburheaders}
              disabled={!tambursData.length}
              filename={`tamburs-dashboard(${date})`}
            >
              <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
              .csv
            </CSVLink>
          </Col>
        </Row>
        <Table
          columns={TambursColumns}
          size="small"
          className="tbs"
          rowKey="id"
          loading={{
            indicator: (
              <Space size="middle">
                <Spin size="large" />
              </Space>
            ),
            spinning: tloading,
          }}
          pagination={false}
          dataSource={tambursData}
        />
      </Tab>
      <Tab eventKey="factorestore" title={t("factor_store")}>
        <Row className="mt-3">
          <Col md={4}>
            <Search
              placeholder={t("search")}
              allowClear
              enterButton
              className="my-md-2"
              onChange={(e) => {
                setFSearch(e.target.value);
              }}
            />
          </Col>
          <Col md={2}>
            <DatePicker
              placeholder={t("date")}
              className="my-2"
              onChange={(date, dateString) => {
                setFDate(dateString);
              }}
            />
          </Col>
          <Col md={2} className=" py-2 d-flex align-items-center">
            <CSVLink
              className="csv-btn"
              data={productionData}
              headers={storeheaders}
              disabled={!productionData.length}
              filename={`facoreyStore-dashboard(${date})`}
            >
              <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
              .csv
            </CSVLink>
          </Col>
        </Row>
        <Table
          columns={ProductionColumn}
          size="small"
          className="tbs"
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
          dataSource={productionData}
        />
      </Tab>
      <Tab eventKey="blackpipestore" title={`${t("blackpipe_store")}`}>
        <>
          <Row className="mt-3">
            <Col md={4}>
              <Search
                placeholder={t("search")}
                allowClear
                enterButton
                className="my-md-2"
                onChange={(e) => {
                  setBSearch(e.target.value);
                }}
              />
            </Col>
            <Col md={2}>
              <DatePicker
                placeholder={t("date")}
                className="my-2"
                onChange={(date, dateString) => {
                  setBDate(dateString);
                }}
              />
            </Col>
            <Col md={2} className=" py-2 d-flex align-items-center">
              <CSVLink
                className="csv-btn"
                data={bStoreData}
                headers={storeheaders}
                disabled={!bStoreData.length}
                filename={`blackpipeStore-dashboard(${date})`}
              >
                <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
                .csv
              </CSVLink>
            </Col>
          </Row>
          <Table
            columns={bStoreColumns}
            size="small"
            className="tbs"
            id="rollsTable"
            rowKey="id"
            pagination={false}
            loading={{
              indicator: (
                <Space size="middle">
                  <Spin size="large" />
                </Space>
              ),
              spinning: bloading,
            }}
            dataSource={bStoreData}
          />
        </>
      </Tab>
      <Tab eventKey="qandelblbasstore" title={`${t("qandelblblas_store")}`}>
        <>
          <Row className="mt-3">
            <Col md={4}>
              <Search
                placeholder={t("search")}
                allowClear
                enterButton
                className="my-md-2"
                onChange={(e) => {
                  setQSearch(e.target.value);
                }}
              />
            </Col>
            <Col md={2}>
              <DatePicker
                placeholder={t("date")}
                className="my-2"
                onChange={(date, dateString) => {
                  setQDate(dateString);
                }}
              />
            </Col>
            <Col md={2} className=" py-2 d-flex align-items-center">
              <CSVLink
                className="csv-btn"
                data={qStoreData}
                headers={storeheaders}
                disabled={!qStoreData.length}
                filename={`qandelblbasStore-dashboard(${date})`}
              >
                <img src={csvIcon} className="img-fluid csv-icon px-2" alt="" />
                .csv
              </CSVLink>
            </Col>
          </Row>
          <Table
            columns={qStoreColumns}
            size="small"
            className="tbs"
            id="rollsTable"
            rowKey="id"
            pagination={false}
            loading={{
              indicator: (
                <Space size="middle">
                  <Spin size="large" />
                </Space>
              ),
              spinning: qloading,
            }}
            dataSource={qStoreData}
          />
        </>
      </Tab>
    </Tabs>
  );
};

export default Dashboard;
