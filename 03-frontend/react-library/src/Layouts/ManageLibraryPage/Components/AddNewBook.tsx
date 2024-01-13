import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";

export const AddNewBook = () => {
    const { authState } = useOktaAuth();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    function getBase64(file: any) {
        // File API: able to convert files such as audio or image to text
        let reader = new FileReader();

        // Data URL: string encoded in B64 of the file + scheme identifier (eg."data:image/png;base64,")
        reader.readAsDataURL(file);

        reader.onload = function () {
            setSelectedImage(reader.result);
        }
        reader.onerror = function (error) {
            console.log('Error', error);
        }

    }

    async function base64ConversionForImages(e: any) {
        // console.log(e);
        if (e.target.files[0]) {
            getBase64(e.target.files[0])
        }
    }


    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input className='form-control' type="text" name='title' required
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Author</label>
                                <input className='form-control' type="text" name='author' required
                                    onChange={e => setAuthor(e.target.value)} value={author} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'>Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    {category}
                                </button>
                                <ul className='dropdown-menu' id='addNewBookId' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'>Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'>Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'>Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3}
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='copies' required
                                onChange={e => setCopies(Number(e.target.value))} value={copies} />
                        </div>
                        {/* encode image to base64 */}
                        <input type='file' onChange={e => base64ConversionForImages(e)} />
                        <div>
                            <button type='button' className='btn btn-primary mt-3'>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}