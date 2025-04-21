import { Link } from 'react-router-dom';

interface MovieProps {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

const MovieCard = ({ imdbID, Title, Year, Poster }: MovieProps) => {
  return (
      <div className="card mb-3" style={{ maxWidth: '540px' }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src={Poster !== 'N/A' ? Poster : '/no-image.jpg'} className="img-fluid rounded-start" alt={Title} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{Title}</h5>
              <p className="card-text"><small className="text-muted">{Year}</small></p>
              <Link to={`/details/${imdbID}`} className="btn btn-sm btn-primary">Details</Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MovieCard;
