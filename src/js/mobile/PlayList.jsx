var React = require("react");

var PlayList = React.createClass({
	getInitialState: function() {
		return {openItemId: -1}
	},

	generateList: function() {
		var videos = this.props.selectedVideos;
		var list = Object.keys(videos).map(function(id) {
			return (
				<div className="media" key={id}>
					<Avatar img = {videos[id].thumbnailUrl}/>
					<ListItem
						title = {videos[id].title}
						user = {videos[id].selectedBy}
					/>
					<ContextMenu />
				</div>
			);
		});

		return list;
	},

	render: function() {
		return(
			<ul className="media-list">
				{this.generateList()}
			</ul>
		);
	}
});

var Avatar = React.createClass({
	render: function() {
		return (
			<div className="media-left media-middle avatar">
				<a href="#">
					<img className="media-object" src={this.props.img} alt="..."/>
				</a>
			</div>
		);
	}
});

var ListItem = React.createClass({
	render: function() {
		return(
			<div className="media-body">
				<h4 className="media-heading">{this.props.user}</h4>
				{this.props.title}
			</div>
		);
	}
});

var ContextMenu = React.createClass({
	render: function() {
		return (
			<div/>
		);
	}
});

module.exports = PlayList;