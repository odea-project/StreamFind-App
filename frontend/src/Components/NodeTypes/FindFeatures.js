import { useCallback, useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayIcon from "@mui/icons-material/PlayCircle";
import axios from "axios";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChangeParameters from "../ChangeParameters";
import { Button, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const handleStyle = { left: 10 };

function FindFeatures({
  type,
  id,
  data: { label, edges, find_features, group_features, setNodes },
  isConnectable,
}) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const [findFeatures, setFindFeatures] = useState([]);
  const [algo, setAlgo] = useState("");
  const [version, setVersion] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectAlgo, setSelectAlgo] = useState(false);
  const [color, setColor] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
    setOpenDialog(false);
    setSelectAlgo(false);
  };

  const openSelectAlgo = () => {
    setSelectAlgo(true);
  };

  const DialogStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    height: 110,
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };

  const ParamStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    maxHeight: 1050,
    overflowY: "auto",
    bgcolor: "white",
    border: "2px solid white",
    borderRadius: "25px",
    p: 5,
  };

  const getFeatures = () => {
    const requestData = {
      fileNames: find_features,
      algorithm: algo,
    };
    axios
      .post("http://127.0.0.1:8000/find_features", requestData)
      .then((response) => {
        console.log("Getting features", response);
        console.log(response.data);
        setFindFeatures(response.data.file_name);
        setOpenDialog(true);
        setColor(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
        console.log(requestData);
      });
  };

  useEffect(() => {
    if (setNodes) {
      setNodes((nds) =>
        nds.map((node) => {
          if (edges.some((edge) => edge.target === node.id)) {
            return {
              ...node,
              data: {
                ...node.data,
                group_features: findFeatures,
              },
            };
          }
          return node;
        })
      );
    }
  }, [findFeatures, group_features, edges, id, setNodes]);

  const getParameters = () => {
    const requestData = {
      fileNames: find_features,
      type: "find_features",
      algorithm: algo,
    };
    axios
      .post("http://127.0.0.1:8000/get_parameters", requestData)
      .then((response) => {
        console.log("Getting Parameters", response);
        setVersion(response.data.version);
        setOpenModal(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
        console.log(requestData);
      });
  };

  return (
    <div>
      <QueryStatsIcon style={{ fontSize: "3em", cursor: "pointer" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <SettingsIcon
          onClick={getParameters}
          style={{ cursor: "pointer" }}
          fontSize="1"
        />
      </div>
      <p style={{ fontSize: "7px", position: "fixed", textAlign: "center" }}>
        find_features
      </p>
      <PlayIcon
        onClick={() => {
          if (algo.length > 0) {
            getFeatures();
          } else {
            openSelectAlgo();
          }
        }}
        style={{
          color: color ? "green" : "red",
          cursor: "pointer",
          fontSize: "10px",
          position: "absolute",
          top: -10,
          left: 19,
        }}
      />
      <Handle
        type="source"
        style={{ background: "blue" }}
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      >
        <p style={{ fontSize: "9px", position: "absolute", top: -12, left: 8 }}>
          out
        </p>
      </Handle>
      <Handle
        type="target"
        style={{ background: "green" }}
        position={Position.Left}
        isConnectable={isConnectable}
      >
        <p
          style={{ fontSize: "9px", position: "absolute", top: -12, left: -9 }}
        >
          in
        </p>
      </Handle>
      <Modal
        open={selectAlgo}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={DialogStyle}>
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="modal-modal-title" variant="h9" component="h2">
            Select Algorithm:
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-label">Select</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={algo}
              onChange={(event) => setAlgo(event.target.value)}
            >
              <MenuItem value="qPeaks">qPeaks</MenuItem>
              <MenuItem value="xcms3_centwave">xcms3_centwave</MenuItem>
              <MenuItem value="xcms3_matchedfilter">
                xcms3_matchedfilter
              </MenuItem>
              <MenuItem value="openms">openms</MenuItem>
              <MenuItem value="kpic2">kpic2ß</MenuItem>
            </Select>
          </FormControl>
          <div>
            <Button onClick={handleClose} variant="contained">
              OK
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={DialogStyle}>
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div style={{ display: "flex" }}>
            <CheckCircleIcon sx={{ color: "green", marginRight: "4px" }} />
            <Typography id="modal-modal-title" variant="h9" component="h2">
              find features applied with {algo}!
            </Typography>
          </div>
          <Button
            style={{ position: "absolute", right: 300, top: 110 }}
            onClick={handleClose}
            variant="contained"
          >
            OK
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ParamStyle}>
          <ChangeParameters
            find_features={find_features}
            handleClose={handleClose}
            algo={algo}
            version={version}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default FindFeatures;
