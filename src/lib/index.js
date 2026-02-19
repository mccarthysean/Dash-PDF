// Import required dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { Printer } from 'lucide-react';

// Create the main PrintButton component
const PrintButton = (props) => {
    // Destructure props with defaults
    const {
        id,
        buttonText = 'Print to PDF',
        className = '',
        setProps,
        hideElements = '.no-print',
        filename = null
    } = props;

    // Function to handle the print action
    const handlePrint = async () => {
        try {
            // Get the original title to restore later
            const originalTitle = document.title;
            
            // Set custom filename if provided
            if (filename) {
                document.title = filename;
            }
            
            // Store elements to hide
            const elementsToHide = document.querySelectorAll(hideElements);
            const originalDisplayValues = new Map();
            
            // Hide specified elements
            elementsToHide.forEach(el => {
                originalDisplayValues.set(el, el.style.display);
                el.style.display = 'none';
            });
            
            // Trigger print dialog
            await window.print();
            
            // Restore original title
            document.title = originalTitle;
            
            // Restore hidden elements
            elementsToHide.forEach(el => {
                const originalDisplay = originalDisplayValues.get(el);
                if (originalDisplay) {
                    el.style.display = originalDisplay;
                } else {
                    el.style.removeProperty('display');
                }
            });

            // Trigger callback if provided
            if (setProps) {
                setProps({ n_clicks: (props.n_clicks || 0) + 1 });
            }
        } catch (error) {
            console.error('Print error:', error);
        }
    };

    // Render the button
    return (
        <button
            id={id}
            onClick={handlePrint}
            className={`btn btn-primary d-flex align-items-center gap-2 ${className}`}
            style={{ cursor: 'pointer' }}
        >
            <Printer className="h-4 w-4" />
            <span>{buttonText}</span>
            <style>
                {`
                    @media print {
                        .no-print { display: none !important; }
                        body { background-color: white !important; }
                        @page { margin: 0.5cm; }
                        * { color: black !important; }
                        .page-break { page-break-before: always; }
                    }
                `}
            </style>
        </button>
    );
};

// PropTypes for type checking
PrintButton.propTypes = {
    // Basic props
    id: PropTypes.string,
    buttonText: PropTypes.string,
    className: PropTypes.string,
    // Dash specific props
    setProps: PropTypes.func,
    n_clicks: PropTypes.number,
    // Custom configuration
    hideElements: PropTypes.string,
    filename: PropTypes.string
};

// Default props
PrintButton.defaultProps = {
    n_clicks: 0,
    buttonText: 'Print to PDF',
    hideElements: '.no-print',
    filename: null
};

export default PrintButton;