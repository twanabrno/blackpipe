import React, { useEffect } from "react";
import { Card, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Nomatch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(() => navigate("/", { replace: true }), 1500);
  });

  return (
    <Container>
      <Row className="mt-5 p-5">
        <Card className="text-center not_found_card align-self-center p-5">
          <Card.Body className="">
            <h1 className="nf_h1">Oops!</h1>
            <h2>404 {t("page_not_found")}</h2>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Nomatch;
