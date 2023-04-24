import React, { useEffect } from "react";
import { Button, Dropdown, Layout, Menu, Space } from "antd";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import cookies from "js-cookie";
import { DownOutlined } from "@ant-design/icons";
import Clock from "react-live-clock";
import FooterComponent from "./FooterComponent";

import "../assets/style.css";

import logo from "../assets/imgs/logo.png";
import kur from "../assets/imgs/ku.svg";
import ar from "../assets/imgs/ar.svg";
import en from "../assets/imgs/en.svg";
import { useAuth } from "./auth";
import wasteIcon from "../assets/imgs/wastes.png";
import dashboardIcon from "../assets/imgs/dashboard.png";
import reportIcon from "../assets/imgs/reports.png";
import productionIcon from "../assets/imgs/productions.png";
import listIcon from "../assets/imgs/list.png";
import rollIcon from "../assets/imgs/rolls.png";
import slitterIcon from "../assets/imgs/slitter.png";
import thinningIcon from "../assets/imgs/thinning.png";
import allproductsIcon from "../assets/imgs/allproducts.png";
import selledIcon from "../assets/imgs/selled.png";
import usersIcon from "../assets/imgs/users.png";
import piecesIcon from "../assets/imgs/pieces.png";
import factoryIcon from "../assets/imgs/factory.png";
import storeIcon from "../assets/imgs/store.png";
import logoutIcon from "../assets/imgs/logout.png";
import tamburIcon from "../assets/imgs/tambur.png";
import spareIcon from "../assets/imgs/spare.png";
import activityIcon from "../assets/imgs/activity.png";

const { Header, Content, Sider } = Layout;

const languages = [
  {
    code: "en",
    name: "English",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "العربية",
    dir: "rtl",
  },
  {
    code: "krd",
    name: "کوردی",
    dir: "rtl",
  },
];

export const SideMenu = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const role = localStorage.getItem("role");
  const currentLanguageCode = cookies.get("i18next") || "en";
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();

  const items = [
    {
      label: "کوردی",
      key: "1",
      icon: (
        <img
          src={kur}
          className="img-fluid lang-icon"
          alt=""
          style={{ opacity: "krd" === currentLanguageCode ? 0.5 : 1 }}
        />
      ),
      disabled: "krd" === currentLanguageCode,
    },
    {
      label: "English",
      key: "2",
      icon: (
        <img
          src={en}
          className="img-fluid lang-icon"
          alt=""
          style={{ opacity: "en" === currentLanguageCode ? 0.5 : 1 }}
        />
      ),
      disabled: "en" === currentLanguageCode,
    },
    {
      label: "عربي",
      key: "3",
      icon: (
        <img
          src={ar}
          className="img-fluid lang-icon"
          alt=""
          style={{ opacity: "ar" === currentLanguageCode ? 0.5 : 1 }}
        />
      ),
      disabled: "ar" === currentLanguageCode,
    },
  ];
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        i18next.changeLanguage("krd");
        break;
      case "2":
        i18next.changeLanguage("en");
        break;
      case "3":
        i18next.changeLanguage("ar");
        break;
      default:
        break;
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const btnLangs = (
    <>
      <Dropdown
        menu={menuProps}
        className="px-2"
        placement={"en" === currentLanguageCode ? "bottomLeft" : "bottomRight"}
        onClick={() => {}}
      >
        <Button>
          <Space>
            <FaGlobe />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  );

  useEffect(() => {
    document.body.dir = currentLanguage.dir || "ltr";
    i18next.changeLanguage(currentLanguageCode);
    document.title = t("blackpipe");
  }, [currentLanguage]);
  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{ height: "unset" }}
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          <div className="logo mb-3">
            <img src={logo} className="img-fluid" alt="" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            style={{ overflowY: "auto" }}
            defaultSelectedKeys={["1"]}
            className={currentLanguageCode == "en" ? "side-enf" : "side-kf"}
            items={[
              {
                key: "1",
                icon: (
                  <img
                    src={dashboardIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("dashboard")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "QandelBlbas" ||
                  role == "Store"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("/");
                },
              },
              {
                key: "2",
                icon: (
                  <img
                    src={reportIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("reports")}</span>,
                className: `${
                  role == "Admin" || role == "Accountant" || role == "Watcher"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("reports");
                },
              },
              {
                key: "3",
                icon: (
                  <img
                    src={rollIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("rolls")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Enter"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("rolls");
                },
              },
              {
                key: "4",
                icon: (
                  <img
                    src={slitterIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("slitter")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Sliter"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("sliter");
                },
              },
              {
                key: "5",
                icon: (
                  <img
                    src={piecesIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("pieces")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Sliter"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("pieces");
                },
              },
              {
                key: "6",
                icon: (
                  <img
                    src={wasteIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("wastes")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Sliter"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("remainings");
                },
              },
              {
                key: "7",
                icon: (
                  <img
                    src={thinningIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("tarqeq")}</span>,
                className: `${
                  role == "Admin" || role == "Accountant" || role == "Watcher"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("tarqeq");
                },
              },
              {
                key: "8",
                icon: (
                  <img
                    src={tamburIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("tambur")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Tambur"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("tambur");
                },
              },
              {
                key: "9",
                icon: (
                  <img
                    src={listIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("s_list")}</span>,
                className: `${
                  role == "Admin" || role == "Accountant" || role == "Watcher"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("productionlist");
                },
              },
              {
                key: "10",
                icon: (
                  <img
                    src={productionIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("productions")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Store"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("productions");
                },
              },
              {
                key: "11",
                icon: (
                  <img
                    src={factoryIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("factor_store")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Store"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("factorystore");
                },
              },
              {
                key: "12",
                icon: (
                  <img
                    src={storeIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("blackpipe_store")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Store"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("blackpipestore");
                },
              },
              {
                key: "13",
                icon: (
                  <img
                    src={storeIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("qandelblblas_store")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "QandelBlbas"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("qandelblbasstore");
                },
              },
              {
                key: "14",
                icon: (
                  <img
                    src={allproductsIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("allproducts")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "QandelBlbas"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("allproduct");
                },
              },
              {
                label: <span>{t("sold_productions")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Watcher" ||
                  role == "Store" ||
                  role == "QandelBlbas"
                    ? ""
                    : "d-none"
                }`,
                icon: (
                  <img
                    src={selledIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                key: "submenu",
                children: [
                  {
                    key: "15",
                    className: "",
                    label: <span>{t("all_sold")}</span>,
                    className: `${
                      role == "Admin" ||
                      role == "Accountant" ||
                      role == "Watcher" ||
                      role == "Store" ||
                      role == "QandelBlbas"
                        ? ""
                        : "d-none"
                    }`,
                    onClick: () => {
                      navigate("allsold");
                    },
                  },
                  {
                    key: "16",
                    className: "",
                    label: <span>{t("sold_qandelblbas")}</span>,
                    className: `${
                      role == "Admin" ||
                      role == "Accountant" ||
                      role == "Watcher" ||
                      role == "Store" ||
                      role == "QandelBlbas"
                        ? ""
                        : "d-none"
                    }`,
                    onClick: () => {
                      navigate("selledQandel");
                    },
                  },
                  {
                    key: "17",
                    className: "",
                    label: <span>{t("sold_blackpipe")}</span>,
                    className: `${
                      role == "Admin" ||
                      role == "Accountant" ||
                      role == "Watcher" ||
                      role == "Store" ||
                      role == "QandelBlbas"
                        ? ""
                        : "d-none"
                    }`,
                    onClick: () => {
                      navigate("selledBlack");
                    },
                  },
                  {
                    key: "18",
                    className: "",
                    label: <span>{t("sold_factory")}</span>,
                    className: `${
                      role == "Admin" ||
                      role == "Accountant" ||
                      role == "Watcher" ||
                      role == "Store" ||
                      role == "QandelBlbas"
                        ? ""
                        : "d-none"
                    }`,
                    onClick: () => {
                      navigate("selledFactory");
                    },
                  },
                  {
                    key: "19",
                    className: "",
                    label: <span>{t("sold_remainings")}</span>,
                    className: `${
                      role == "Admin" ||
                      role == "Accountant" ||
                      role == "Watcher" ||
                      role == "Store" ||
                      role == "QandelBlbas"
                        ? ""
                        : "d-none"
                    }`,
                    onClick: () => {
                      navigate("selledwastings");
                    },
                  },
                ],
              },
              {
                key: "20",
                icon: (
                  <img
                    src={spareIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("spare_parts")}</span>,
                className: `${
                  role == "Admin" ||
                  role == "Accountant" ||
                  role == "Store" ||
                  role == "Watcher"
                    ? ""
                    : "d-none"
                }`,
                onClick: () => {
                  navigate("spare");
                },
              },
              {
                key: "21",
                icon: (
                  <img
                    src={activityIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("activity")}</span>,
                className: `${role == "Admin" ? "" : "d-none"}`,
                onClick: () => {
                  navigate("activity");
                },
              },
              {
                key: "22",
                icon: (
                  <img
                    src={usersIcon}
                    className="img-fluid slider_icon"
                    alt=""
                  />
                ),
                label: <span>{t("users")}</span>,
                className: `${role == "Admin" ? "" : "d-none"}`,
                onClick: () => {
                  navigate("users");
                },
              },
            ]}
          />
        </Sider>
        <Layout style={{ overflowY: "auto" }}>
          <Header
            className="py-2 px-3 px-md-4  header-width"
            style={{
              position: "fixed",
              zIndex: "100",
              background: "#fff",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {btnLangs}
                <h6 className="mx-2 m-0 user-name">
                  {localStorage.getItem("username")}
                </h6>
              </div>
              <div className="d-flex align-items-center">
                <div className="date_time text-end">
                  <div className="live-date">
                    <Clock format="ddd DD.MM.YY" />
                  </div>
                  <div className="live-time">
                    <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                  </div>
                </div>
                <div className="">
                  <div
                    onClick={() => auth.logout()}
                    className="logout-btn d-flex align-items-top mx-3"
                  >
                    <img
                      src={logoutIcon}
                      className="img-fluid logout_icon"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </Header>
          <Content className="mx-1 mx-md-3" style={{ margin: "75px 16px 0" }}>
            <div
              style={{
                padding: 24,
                paddingBottom: 15,
                background: "#fff",
                minHeight: "85vh",
              }}
            >
              <Outlet />
            </div>
            <FooterComponent />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default SideMenu;
