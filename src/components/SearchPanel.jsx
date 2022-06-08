import { useEffect, useState } from "react";
import { suggestWord, saveWord, deleteWord } from "./GetWords";
import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import './styles/searchpanel.css';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { TableHead } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { Modal, Typography, Button } from "@mui/material";
import { Stack, MenuItem } from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
// Delete modal style
const modalStyle = {
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

const WordTypes = [
  {label: 'Noun', value: 0},
  {label: 'Pronoun', value: 1},
  {label: 'Adjective', value: 2},
  {label: 'Adverb', value: 3},
  {label: 'Preposition', value: 4},
  {label: 'Conjunction', value: 5},
  {label: 'Interjection', value: 6},
  {label: 'Verb', value: 7},
  {label: 'Phrasal Verb', value: 8},
  {label: 'Phrase', value: 9}
]


export default function SearchPanel(props) {
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [edit, setEdit] = useState(() => words.map(() => false));
  const [openDeleteMdoal, setOpenDeleteModal] = useState(false);
  const [number, setNumber] = useState();
  const [openNewWordModal, setOpenNewWordModal]= useState(false);
  const [newWord, setNewWord] = useState({id:"",en:"",fa:"",wordType:""})

  async function Data(word) {
    if (word.length > 2) {
      const response = await suggestWord(word).then((value) => value.data);
      console.log(response);
      setWords(response)
      return response
    } else {
      return [];
    }
  }


  function autoComplete(word) {
    if (props.query.length > 2) {
      Data(word);
      return words;
    } else {
      return [
        {
          en: 'Word must be more than 2 letters'
        }
      ]
    }
  }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - words.length) : 0;

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    }; 
    
    // handles the searchbar input changes
    const inputChange = (e) => {
      props.setQuery(e.target.value)
      autoComplete(e.target.value);
    }


    // Opens the Delete submit modal
    const handleOpenDeleteModal = (index) => {
      setNumber(index);
      setOpenDeleteModal(true);
    }
    const handleCloseDeleteModal = () => {
      setOpenDeleteModal(false);
    }

    // Opens the New Word modal
    const handleOpenNewWordModal = () => {
      setOpenNewWordModal(true);
    }

    const handleCloseNewWordModal = () => {
      setOpenNewWordModal(false);
      setNewWord({id:"",en:"",fa:"",wordType:""});
    }

    // Submits the new word to the server
    const handleSubmitNewWord = () => {
      saveWord(newWord);
      setNewWord({id:"",en:"",fa:"",wordType:""});
      setOpenNewWordModal(false);
    }


    const editOn = (index) => {
      const newState = [...edit];
      newState[index] = true;
      setEdit(newState);
    };

    const editCancel = (index) => {
      const newState = [...edit];
      newState[index] = false;
      setEdit(newState);
    }

    const editSave = (index) => {
        const newState = [...edit];
        newState[index] = false;
        setEdit(newState);
        // saves the words to the server
        saveWord(words[index]);
    };

    const handleChangeEn = (event,id) => {
      const newWords = [...words];
      const index = words.findIndex((word) => word.id === id);

      newWords[index].en = event.target.value;
      setWords(newWords);
    };

    const handleChangeFa = (event,id) => {
      const newWords = [...words];
      const index = words.findIndex((word) => word.id === id);

      newWords[index].fa = event.target.value;
      setWords(newWords);
    };


    const handleChangeWT = (event,id) => {
      const newWords = [...words];
      const index = words.findIndex((word) => word.id === id);

      newWords[index].wordType = event.target.value;
      setWords(newWords);
    };


    const handleDeleteSubmit = (index) => {
      const removeTitle = [...words];
      deleteWord(removeTitle[number]);
      removeTitle.splice(number,1);
      setWords(removeTitle);
      setOpenDeleteModal(false);
  };

   return (
       <>
       <div className="input">
       <Stack spacing={2} sx={{ width: 500 }}>
   
               <TextField 
                 value={props.query}
                 inputValue={props.query}
                 onChange={inputChange}
                 onInputChange={inputChange}
                 label="Search"/>
          
        </Stack>
        <span style={{ width : '150px', textAlign: 'center' }}>
          <FormControlLabel
            value="top"
            control={<Checkbox/>}
            label="Confirmed"
            labelPlacement="top"
          />
        </span>
        <Button variant="outlined" onClick={handleOpenNewWordModal}>New Word</Button>
        </div>
       <div className="result">
       <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>English Word</StyledTableCell>
            <StyledTableCell >Translation</StyledTableCell>
            <StyledTableCell>Word Type</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 
          ? words.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : words
          ).map((row,index) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell key={row.id} component="th" scope="row">
                <input type="text"
                 value={row.en}
                 disabled={!edit[index]}
                 onChange={(event) => handleChangeEn(event,row.id)}
                 />
              </StyledTableCell>
              <StyledTableCell align="left">
                <input type="text" 
                value={row.fa}
                disabled={!edit[index]}
                onChange={(event) => handleChangeFa(event,row.id)}
                />
                </StyledTableCell>
              <StyledTableCell align="left">
                <select value={row.wordType} onChange={(event) => handleChangeWT(event,row.id)} disabled={!edit[index]}>
                  <option></option>
                  {WordTypes.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                </StyledTableCell>
                <StyledTableCell>

                <div className="actionItems">
                <div className='checkIcon'><CheckIcon onClick={() => editSave(index)} sx={{height: 30, display: edit[index] ? 'block' : 'none'}}/> </div>
                  <div className='cancelIcon'><CancelIcon onClick={() => editCancel(index)} sx={{height: 30, display: edit[index] ? 'block' : 'none'}}/> </div>
                  <div className='editIcon'><EditIcon onClick={() => editOn(index)} sx={{height: 30, display: edit[index] ? 'none' : 'block' }} /></div>
                  <div className='deleteIcon'><DeleteIcon onClick={() => handleOpenDeleteModal(index)} sx={{height: 30}}  /></div>
                </div>
                </StyledTableCell>
            </StyledTableRow>
          ))}
           {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={words.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    <div>
    <Modal
        open={openDeleteMdoal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div style={{textAlign: 'center'}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>
            
          <div className='modalSpace'></div>
          <Button variant='contained' onClick={handleDeleteSubmit}>Yes, Delete it!</Button>
          <span className='buttonSpace'></span>
          <Button variant='outlined' onClick={handleCloseDeleteModal}>No, cancel.</Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openNewWordModal}
        onClose={handleCloseNewWordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div style={{textAlign: 'center'}}>
          <TextField
          label="English Word"
          variant="outlined"
          value={newWord.en}
          onChange={(e) => {
            const english = {...newWord};
            english.en = e.target.value;
            setNewWord(english);
          }}
          sx={{marginBottom: '10px'}}
          />
          <TextField
          label="Farsi Translation"
          variant="outlined"
          value={newWord.fa}
          onChange={(e) => {
            const farsi = {...newWord};
            farsi.fa = e.target.value;
            setNewWord(farsi);
          }}
          sx={{marginBottom: '10px'}}
          />
          <TextField
          label="Word Type"
          select
          variant="outlined"
          value={newWord.wordType}
          onChange={(e) => {
            const wType = {...newWord};
            wType.wordType = e.target.value;
            setNewWord(wType);
          }}
          sx={{width: 210}}
          >
            {WordTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          </TextField>
          <div className='modalSpace'></div>
          <Button variant='contained' onClick={handleSubmitNewWord}>Save it!</Button>
          <span className='buttonSpace'></span>
          <Button variant='outlined' onClick={handleCloseNewWordModal}>Close</Button>
          </div>
        </Box>
      </Modal>
    </div>
       </div>
       </>
   )
}