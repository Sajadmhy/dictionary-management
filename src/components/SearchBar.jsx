import { useState } from 'react';
import './styles/searchbar.css';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';


// Delete modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  

export default function SearchBar(props) {
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState([ {title:"Sajad"},
    {title:"Saeid"},]);
    const [open, setOpen] = useState(false);
    const [number, setNumber] = useState();



    // Opens the Delete submit modal
    const handleOpen = (index) => {
        setNumber(index);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const editOn = (index) => {
        const newState = [...edit];
        newState[index] = true;
        setEdit(newState);
    };

    const editOff = (index) => {
        const newState = [...edit];
        newState[index] = false;
        setEdit(newState);
    };

    const handleChange = (index, event) => {
        const newTitle = [...title];
        newTitle[index] = event.target.value;
        setTitle(newTitle);
    };

    const handleDeleteSubmit = () => {
        const removeTitle = [...title];
        removeTitle.splice(number,1);
        setTitle(removeTitle);
        setOpen(false);
    };

  return (
      <div className='container'>
        <div className='searchbar'>
        <Stack spacing={2} sx={{ width: 500 }}>
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            inputValue={props.query}
            onChange={(e,newValue) => props.setQuery(newValue)}
            disableClearable
            options={Data(props.query).map((option) => option.en)}
            renderInput={(params) => <TextField 
                onChange={e => props.setQuery(e.target.value)} {...params}
                 label="Dictionary"/>}
            />
        </Stack>
        </div>
        <div className='list'>
        {
        Data(props.query).filter((option) => {
            if (props.query === '') {
                return option;
            } else if (option.toLowerCase().includes(props.query.toLowerCase())) {
                return option;
            }
        }).map((option, index) => 
            <div className='listOption' key={index}>
            <input 
            value={title[index]}
            disabled={!edit[index]}
            onChange={(event) => handleChange(index, event)}
            />
            <span></span>
            <div className='checkIcon'><CheckIcon onClick={() => editOff(index)} sx={{height: 30, display: edit[index] ? 'block' : 'none'}}/></div>
            <div className='editIcon'><EditIcon  onClick={(event) => editOn(index, event)} sx={{height: 30, display: edit[index] ? 'none' : 'block', marginRight: edit[index] ? '0px' : '5px' }}/></div>
            <div className='deleteIcon'><DeleteIcon sx={{height: 30}} onClick={() => handleOpen(index)} /></div>
            </div>
            )
        }
        </div>
        <div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>
          <div className='modalSpace'></div>
          <Button variant='contained' onClick={handleDeleteSubmit}>Yes, Delete it!</Button>
          <span className='buttonSpace'></span>
          <Button variant='outlined' onClick={handleClose}>No, cancel.</Button>
        </Box>
      </Modal>
        </div>
    </div>
  );
}

