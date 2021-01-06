import React, { Component }from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
    state = {
        newRepository: '',
        repositories: [],
        loading: false,
    };

    //Carregar os dados do local storage
    componentDidMount(){
        const repositories = localStorage.getItem('repositories');

        if(repositories){
            this.setState({repositories: JSON.parse(repositories)});
        }
    }

    //Salvar os dados no local storage
    componentDidUpdate(_, prevState){
        const { repositories } = this.state;

        if(prevState.repositories != repositories){
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleinputChange = e => {
        this.setState({newRepository: e.target.value});
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({loading: true});

        const { newRepository, repositories } = this.state;

        const response = await api.get(`/repos/${newRepository}`);

        const data = {
            name: response.data.full_name,
        };

        this.setState({
            repositories: [... repositories, data],
            newRepository: '',
            loading: false
        });
    };

    render(){
        const { newRepository, loading, repositories } = this.state;

        return(
            <Container>

                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepository}
                        onChange={this.handleinputChange}
                    />

                    <SubmitButton loading={loading}>
                        { loading ? (
                            <FaSpinner color="#fff" size={14}/>
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>

                </Form>

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
                        </li>
                    ))}
                </List>

            </Container>
        );
    }
}


