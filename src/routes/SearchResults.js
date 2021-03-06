import React, { Component } from 'react'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Truncate from 'react-truncate'

import WatchButton from '../components/WatchButton'
const tmdb = require('moviedb')('2e0bfe56b018618b270a6e0428559292')

const styles = theme => ({
	card: {
		display: 'flex',
		flexDirection: 'column',
		height: 500,
		width: 300,
		margin: theme.spacing.unit
	},
	media: {
		height: 250
	},
	button: {
		marginBottom: theme.spacing.unit,
		marginLeft: theme.spacing.unit
	},
	searchText: {
		margin: theme.spacing.unit * 5
	},
	cardWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center'
	}
})

const MediaType = props => {
	if (props.media === 'tv') {
		return 'TV Show'
	} else if (props.media === 'movie') {
		return 'Movie'
	} else {
		return 'Unknown'
	}
}

class SearchResults extends Component {
	constructor() {
		super()
		this.state = {
			results: [],
			listItems: ''
		}
	}
	handleSearch(term) {
		const { classes } = this.props
		if (term !== '') {
			tmdb.searchMulti({ query: term }, (err, res) => {
				this.setState({
					results: res.results,
					listItems: res.results.map(item => (
						<Card className={classes.card} key={item.id}>
							<CardMedia
								className={classes.media}
								image={'https://image.tmdb.org/t/p/w500/' + item.poster_path}
								title={item.title || item.name + ' Poster'}
							/>
							<CardContent style={{ flex: 1 }}>
								<Typography variant="headline" component="h2">
									{item.title || item.name}
								</Typography>
								<Typography
									variant="subheading"
									component="h3"
									style={{ marginBottom: 5, marginTop: 3 }}
								>
									<MediaType media={item.media_type} />
								</Typography>
								<Typography
									component="p"
									style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									<Truncate lines={5} ellipsis="...">
										{item.overview}
									</Truncate>
								</Typography>
							</CardContent>
							<CardActions>
								<WatchButton id={item.id} type={item.media_type} />
							</CardActions>
						</Card>
					))
				})
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		this.handleSearch(nextProps.match.params.term)
	}
	componentDidMount() {
		this.handleSearch(this.props.match.params.term)
	}
	render() {
		const { classes } = this.props
		return (
			<div>
				<div className={this.props.classes.searchText}>
					<Typography style={{ textAlign: 'center' }} variant="display1">
						Search results for <strong>{this.props.match.params.term}</strong>
					</Typography>
				</div>
				<div className={classes.cardWrapper}>{this.state.listItems}</div>
			</div>
		)
	}
}

export default withStyles(styles)(SearchResults)
