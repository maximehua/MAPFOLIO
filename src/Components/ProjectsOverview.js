import React, { Component } from 'react';
import styled from 'styled-components';
import SimpleMap from './SimpleMap.js'
import { getCurrentProjects } from './backend.js';

const darkGreen = "#24282b";

const Wrapper = styled.div`
    background-color: ${darkGreen};
    width: 100vw;
    height: 100vh;
    background-color: grey;
    display: block;
    justify-content: center;
    align-items: center;
`;

class ProjectsOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objects: [{
                projectId: "",
                completionStatus: {},
                startDate: "",
                endDate: "",
                address: "",
                coords: { lat: "", lng: "" },
                description: "",
                name: "",
                current: true,
                cancelled: false,
                notes: ''
            }]
        }
    }

    componentWillMount() {
        getCurrentProjects(this.props.user.id)
            .then(objects => {
                this.setState({
                    objects: objects
                })
            }
            )
    }

    _updateProject = async () => {
        await getCurrentProjects(this.props.user.id)
            .then(objects => {
                this.setState({
                    objects: objects
                })
            }
            )
    }

    // const str = "Crème Brulée"
    // str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    // > 'Creme Brulee'
    // Two things are happening here:
    // 1. normalize()ing to NFD Unicode normal form decomposes combined graphemes into the combination of simple ones. The è of Crème ends up expressed as e + ̀.
    // 2. Using a regex character class to match the U+0300 → U+036F range, it is now trivial to globally get rid of the diacritics, which the Unicode standard conveniently groups as the Combining Diacritical Marks Unicode block.

    _searchFunction = async () => {
        const raw = await getCurrentProjects(this.props.user.id) //this.state.objects
        const filtered = raw.filter(p =>
            p.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.state.searchText.toLowerCase())
            || p.description.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.state.searchText.toLowerCase())
            || p.address.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.state.searchText.toLowerCase())
            || p.id.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.state.searchText.toLowerCase())
        )
        this.setState({
            ...this.state,
            objects: filtered
        })
    }

    _searchInput = (e) => {
        this.setState({
            ...this.state,
            searchText: e.target.value
        })
    }

    _clearSearch = () => {
        getCurrentProjects(this.props.user.id)
            .then(objects => {
                this.setState({
                    ...this.state,
                    objects: objects,
                    searchText: ''
                })
            }
            )
    }

    render() {
        return (
            <Wrapper>
                {/* {this.props.isLoggedIn ? */}
                <SimpleMap
                    objects={this.state.objects}
                    setHover={this._setHover}
                    user={this.props.user}
                    handleLogout={this.props.handleLogout}
                    updateProjects={this._updateProject}
                    searchFunction={this._searchFunction}
                    searchInput={this._searchInput}
                    clearSearch={this._clearSearch}
                    searchText={this.state.searchText}
                />
                {/* : */}
                {/* <Link to={"/"}><h2> Please login to view </h2></Link>} */}
            </Wrapper>
        )
    }
}

export default ProjectsOverview;