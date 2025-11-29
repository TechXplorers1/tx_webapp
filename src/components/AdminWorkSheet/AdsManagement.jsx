import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, serverTimestamp, onValue, remove, update } from "firebase/database";
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button for admin management UI

const AdsManagement = () => {
    // Get the database instance
    const database = getDatabase();
    
    // --- 1. STATES ---
    // State for the NEW Card form
    const [welcomeCard, setWelcomeCard] = useState({
        title: '',
        message: '',
        targetDate: '', // YYYY-MM-DD for when to display it
        imageUrl: '', // Optional image URL
    });
    const [loading, setLoading] = useState(false);
    
    // States for POSTED Cards management
    const [postedCards, setPostedCards] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState(null);
    const [deleteCardKey, setDeleteCardKey] = useState(null);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);


    // --- 2. DATA FETCHING (Listen for all cards) ---
    useEffect(() => {
        const cardRef = ref(database, 'welcomeCards');
        
        const unsubscribe = onValue(cardRef, (snapshot) => {
            const cardsData = snapshot.val();
            const cardsList = [];
            if (cardsData) {
                // Convert the Firebase object into an array with the Firebase key (id)
                for (let key in cardsData) {
                    cardsList.push({
                        id: key,
                        ...cardsData[key]
                    });
                }
            }
            // Sort by creation date (optional, newest first)
            cardsList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); 
            setPostedCards(cardsList);
        });

        return () => unsubscribe(); // Cleanup the listener
    }, [database]);


    // --- 3. CREATE & INPUT HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setWelcomeCard(prev => ({ ...prev, [name]: value }));
    };

    const handlePostWelcomeCard = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!welcomeCard.title || !welcomeCard.message || !welcomeCard.targetDate) {
            alert("Title, Message, and Target Date are required.");
            setLoading(false);
            return;
        }

        try {
            const cardRef = ref(database, 'welcomeCards');
            await push(cardRef, {
                ...welcomeCard,
                createdAt: serverTimestamp(),
            });
            
            alert("Welcome Card posted successfully! 🎉");
            setWelcomeCard({ title: '', message: '', targetDate: '', imageUrl: '' }); // Reset form
        } catch (error) {
            console.error("Failed to post Welcome Card:", error);
            alert("Error posting card.");
        } finally {
            setLoading(false);
        }
    };


    // --- 4. EDIT HANDLERS ---
    const handleEditClick = (card) => {
        setCardToEdit(card);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCardToEdit(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!cardToEdit || !cardToEdit.id) return;

        setLoading(true);
        // Target the specific card's path using its ID
        const cardRef = ref(database, `welcomeCards/${cardToEdit.id}`);
        try {
            await update(cardRef, {
                title: cardToEdit.title,
                message: cardToEdit.message,
                targetDate: cardToEdit.targetDate,
                imageUrl: cardToEdit.imageUrl,
            });
            alert("Card updated successfully! 👍");
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Failed to update card:", error);
            alert("Error updating card.");
        } finally {
            setLoading(false);
        }
    };


    // --- 5. DELETE HANDLERS ---
    const handleDeleteClick = (cardId) => {
        setDeleteCardKey(cardId);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteCardKey) return;
        
        setLoading(true);
        // Target the specific card's path using its ID
        const cardRef = ref(database, `welcomeCards/${deleteCardKey}`);
        try {
            await remove(cardRef); // Use remove() to delete the node
            alert("Card deleted successfully! 🗑️");
            setIsDeleteConfirmModalOpen(false);
        } catch (error) {
            console.error("Failed to delete card:", error);
            alert("Error deleting card.");
        } finally {
            setLoading(false);
            setDeleteCardKey(null);
        }
    };

    // --- 6. RENDER JSX ---
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* 6A. CREATE FORM */}
            <h2>Create New Welcome Card</h2>
            <form onSubmit={handlePostWelcomeCard} style={{ display: 'grid', gap: '15px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <input type="text" name="title" placeholder="Card Title (e.g., Happy Holidays!)" value={welcomeCard.title} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                
                <textarea name="message" placeholder="Welcome Message (e.g., Wishing you the best for the season...)" value={welcomeCard.message} onChange={handleChange} required rows="4" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}></textarea>
                
                <label style={{ fontWeight: 'bold', margin: '0' }}>Target Display Date:</label>
                <input type="date" name="targetDate" value={welcomeCard.targetDate} onChange={handleChange} required style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
                
                <input type="url" name="imageUrl" placeholder="Optional Image URL (for a festive banner)" value={welcomeCard.imageUrl} onChange={handleChange} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Posting...' : 'Post Welcome Card'}
                </button>
            </form>

            <hr style={{ margin: '40px 0' }} />

            {/* 6B. POSTED CARDS LIST (Admin View) */}
            <h2>Posted Welcome Cards Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {postedCards.length === 0 ? (
                    <p>No welcome cards posted yet.</p>
                ) : (
                    postedCards.map(card => (
                        // Display the card in a preview
                        <div key={card.id} style={{ 
                            border: card.targetDate === new Date().toISOString().split('T')[0] ? '3px solid #575b58ff' : '1px solid #ddd', // Highlight active card
                            borderRadius: '8px', 
                            padding: '15px', 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#ffffff'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{card.title}</h4>
                            {card.imageUrl && (
                                <img src={card.imageUrl} alt="Card Preview" style={{ maxWidth: '10%', height: 'auto', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />
                            )}
                            <p style={{ fontSize: '0.9rem', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{card.message}</p>
                            <p style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: 'bold' }}>
                                **Target Date:** {card.targetDate} 
                                {card.targetDate === new Date().toISOString().split('T')[0] && (
                                    <span style={{ color: '#28a745', marginLeft: '10px' }}> (ACTIVE TODAY)</span>
                                )}
                            </p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <Button variant="warning" onClick={() => handleEditClick(card)} style={{ flex: 1 }}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(card.id)} style={{ flex: 1 }}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* 6C. EDIT CARD MODAL */}
            <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Welcome Card</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSaveEdit}>
                    <Modal.Body>
                        {cardToEdit && (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Card Title"
                                    value={cardToEdit.title || ''}
                                    onChange={handleEditChange}
                                    required
                                    className="form-control"
                                />
                                <textarea
                                    name="message"
                                    placeholder="Welcome Message"
                                    value={cardToEdit.message || ''}
                                    onChange={handleEditChange}
                                    required
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                                <label style={{ fontWeight: 'bold', margin: '0' }}>Target Display Date:</label>
                                <input
                                    type="date"
                                    name="targetDate"
                                    value={cardToEdit.targetDate || ''}
                                    onChange={handleEditChange}
                                    required
                                    className="form-control"
                                />
                                <input
                                    type="url"
                                    name="imageUrl"
                                    placeholder="Optional Image URL"
                                    value={cardToEdit.imageUrl || ''}
                                    onChange={handleEditChange}
                                    className="form-control"
                                />
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* 6D. DELETE CONFIRMATION MODAL */}
            <Modal show={isDeleteConfirmModalOpen} onHide={() => setIsDeleteConfirmModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#dc3545' }}>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Welcome Card? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsDeleteConfirmModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete Card'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdsManagement;
