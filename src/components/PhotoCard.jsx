function PhotoCard({ photo }) {
  return (
    <div className="photo-card">
      <div className="photo-image">
        <img src={photo.image} alt={photo.title} />
        <div className="photo-overlay">
          <div className="photo-info">
            <h3>{photo.title}</h3>
            {photo.description && <p>{photo.description}</p>}
          </div>
        </div>
      </div>
      <div className="photo-details">
        <span className="photo-category">{photo.category}</span>
        {photo.date && <span className="photo-date">{new Date(photo.date).toLocaleDateString('fr-FR')}</span>}
      </div>
    </div>
  );
}

export default PhotoCard;
