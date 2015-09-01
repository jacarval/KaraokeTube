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
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Collapsible Group Item #1
        </a>
      </h4>
    </div>

    <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
		);
	}
});

module.exports = PlayList;