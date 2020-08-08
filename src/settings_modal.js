import { Modal, Button, ListGroup } from "react-bootstrap";
import React from "react";

const CONFIGURABLE_KEYS = [
  "opacity",
  "translate_speed",
  "translate_speed_low",
  "rotate_speed",
  "rotate_speed_low",
];

function Row({ subConfig, setSubConfig, configKey }) {
  const ref = React.useRef();
  return (
    <ListGroup.Item>
      {configKey}:{" "}
      <input
        type="number"
        step={0.01}
        min={0}
        defaultValue={subConfig[configKey]}
        ref={ref}
        onChange={() =>
          setSubConfig({
            ...subConfig,
            [configKey]: parseFloat(ref.current.value),
          })
        }
      />
    </ListGroup.Item>
  );
}

export default function SettingsModal({
  isSettingsShown,
  setIsSettingsShown,
  config,
  setConfig,
}) {
  const [subConfig, setSubConfig] = React.useState(
    Object.fromEntries(CONFIGURABLE_KEYS.map((key) => [key, config[key]]))
  );
  return (
    <Modal show={isSettingsShown} onHide={() => setIsSettingsShown(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {CONFIGURABLE_KEYS.map((key) => (
            <Row {...{ subConfig, setSubConfig, configKey: key, key }} />
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            setConfig({ ...config, ...subConfig });
            setIsSettingsShown(false);
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
