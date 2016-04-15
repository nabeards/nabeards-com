var main = 'main',
    column = 'column',
    styleTitle = {
        fontWeight: 'bold'
    },
    styleDivSection = {
        marginBottom: '2em'
    },
    styleMain = {
        clear: 'both',
        textAlign: 'left'
    },
    styleCompany = {
        fontWeight: 'bold',
        fontSize: 'large'
    },
    styleDescription = {
        display: 'flex',
        justifyContent: 'center',
        fontStyle: 'italic'
    },
    styleDate = {
        fontWeight: 'bold'
    },
    styleMainLink = {
        height: 'auto',
        display: 'flex',
        justifyContent: 'center'
    },
    styleEmail = {},
    styleMyName = {
        fontWeight: 'bold',
        fontSize: 'x-large'
    },
    stylePhone = {
        textDecoration: 'none'
    },
    styleBulletlessList = {
        li: {
            listStyleType: 'none',
            listStylePosition: 'inside',
        },
        ul: {
            padding: 0,
            margin: 0
        }
    },
    styleSubhead = {
        height: 'auto',
        fontSize: 'small'
    },
    styleLeftCol = {
        clear: 'both',
        display: 'flex',
        alignItems: 'flex-end',
        float: 'left',
        minHeight: '30px',
        width: '30%'
    },
    styleCenterCol = {
        display: 'flex',
        alignItems: 'flex-end',
        float: 'left',
        overflow: 'hidden',
        minHeight: '30px',
        width: '40%',
        justifyContent: 'center',
        textAlign: 'center'
    },
    styleRightCol = {
        display: 'flex',
        alignItems: 'flex-end',
        float: 'right',
        justifyContent: 'flex-end',
        textAlign: 'right',
        minHeight: '30px',
        width: '30%'
    };

var ResumeDetail = React.createClass({
    cleanPhoneNumber: function (number) {
        let clean = '',
            i = 0;

        if (!number || !number.length) {
            return '';
        }

        for (; i < number.length; i += 1) {
            if ((number.charAt(i) >= '0') && (number.charAt(i) <= '9')) {
                clean += number.charAt(i);
            }
        }

        return clean;
    },
    metaContent: function (content) {
        var links = this.props.content.metaLink;
        if (links) {
            Object.keys(links).forEach(function (text) {
                console.log('link', text, links[text]);
                content = content.replace(text, '<a href="' + links[text] + '" target="_blank">' + text + '</a>');
                console.log(content);
            });
        }
        console.log({ __html: content });
        return { __html: content };
    },
    parseDetail: function (section, type, style) {
        var content = this.props.content[type],
            resumeDetail = this;

        function getList() {
            content = content.map(function (elem, i) {
                return <li key={Date.now() + i} style={style.li} dangerouslySetInnerHTML={resumeDetail.metaContent(elem)} />;
            });
        }
        if (!content) {
            return;
        }

        switch (type) {
        case 'email':
            return <div><a style={style} href={'mailto:' + content}>{content}</a></div>;
            break;
        case 'phone':
            return <div><a style={style} href={'tel:' + this.cleanPhoneNumber(content)}>{content}</a></div>
            break;
        case 'link':
            return <div><a style={style} href={'http://' + content} target="_blank">{content}</a></div>;
            break;
        default:
            if ((section === main) && (Array.isArray(content))) {
                getList();
                return <div style={style}><ul style={style.ul}>{content}</ul></div>;
            } else {
                return <div style={style} dangerouslySetInnerHTML={this.metaContent(content)} />;
            }
        }
    },
    render: function () {
        var styleHeader = this.props.contentCenter ? {} : { display: 'none' },
            styleHeaderBottom = this.props.contentCenterBottom ? {} : { display: 'none' };

        return (
            <div style={styleDivSection} class="resumeDetail">
                <div style={styleHeader}>
                    {this.parseDetail(column, this.props.contentLeft, Object.assign({}, styleLeftCol, this.props.styleLeft))}
                    {this.parseDetail(column, this.props.contentCenter, Object.assign({}, styleCenterCol, this.props.styleCenter))}
                    {this.parseDetail(column, this.props.contentRight, Object.assign({}, styleRightCol, this.props.styleRight))}
                </div>
                <div style={styleHeaderBottom}>
                    {this.parseDetail(column, this.props.contentLeftBottom, Object.assign({}, styleLeftCol, this.props.styleLeftBottom))}
                    {this.parseDetail(column, this.props.contentCenterBottom, Object.assign({}, styleCenterCol, this.props.styleCenterBottom))}
                    {this.parseDetail(column, this.props.contentRightBottom, Object.assign({}, styleRightCol, this.props.styleRightBottom))}
                </div>
                {this.parseDetail(main, this.props.contentMain, Object.assign({}, styleMain, this.props.styleMain))}
                {this.parseDetail(main, this.props.contentMain2, Object.assign({}, styleMain, this.props.styleMain2))}
                {this.parseDetail(main, this.props.contentMain3, Object.assign({}, styleMain, this.props.styleMain3))}
            </div>
        );
    }
});

var ResumeSection = React.createClass({
    getInitialState: function () {
        return { data: []};
    },
    loadPersonalInfo: function () {
        $.ajax({
            url: 'api/' + this.props.contentUrl,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    },
    componentDidMount: function () {
        setTimeout(this.loadPersonalInfo, this.props.loadTimeout);
    },
    render: function () {
        var styleProgress = {
                display: 'block',
                margin: '0 auto'
            },
            props = this.props,
            styleHeader = this.props.titleOff ? { display: 'none' } : {},
            details = [];

        if (this.state.data.length > 0) {
            details = this.state.data.map(function (detail) {
                return (
                    <ResumeDetail
                        key={detail.id}
                        content={detail}
                        contentLeft={props.contentLeft}
                        styleLeft={props.styleLeft}
                        contentCenter={props.contentCenter}
                        styleCenter={props.styleCenter}
                        contentRight={props.contentRight}
                        styleRight={props.styleRight}
                        contentLeftBottom={props.contentLeftBottom}
                        styleLeftBottom={props.styleLeftBottom}
                        contentCenterBottom={props.contentCenterBottom}
                        styleCenterBottom={props.styleCenterBottom}
                        contentRightBottom={props.contentRightBottom}
                        styleRightBottom={props.styleRightBottom}
                        contentMain={props.contentMain}
                        styleMain={props.styleMain}
                        contentMain2={props.contentMain2}
                        styleMain2={props.styleMain2}
                        contentMain3={props.contentMain3}
                        styleMain3={props.styleMain3}
                    />
                );
            });
            styleProgress = { display: 'none' };
        }

        return (
            <div style={styleDivSection} className="resumeSection">
                <h1 style={styleHeader}>{props.title}</h1>
                <img style={styleProgress} src="images/progress.gif" />
                {details}
            </div>
        );
    }
});

var ResumeBox = React.createClass({
    render: function () {
        return (
            <div class="resumeBox">
                <ResumeSection
                    title="General Info"
                    titleOff={true}
                    contentUrl="personalInfo.json"
                    contentLeft="email"
                    styleLeft={styleEmail}
                    contentCenter="name"
                    styleCenter={styleMyName}
                    contentRight="phone"
                    styleRight={stylePhone}
                    contentMain="objective"
                    loadTimeout={this.props.loadTimeout * 4}
                />
                <ResumeSection
                    title="Languages & Technologies"
                    contentUrl="languagesTechnologies.json"
                    contentMain="tech"
                    styleMain={styleBulletlessList}
                    loadTimeout={this.props.loadTimeout * 3}
                />
                <ResumeSection
                    title="Work Experience"
                    contentUrl="workExperience.json"
                    contentLeft="title"
                    styleLeft={styleTitle}
                    contentCenter="company"
                    styleCenter={styleCompany}
                    contentRight="date"
                    styleRight={styleDate}
                    contentMain="description"
                    styleMain={styleDescription}
                    contentMain2="link"
                    styleMain2={styleMainLink}
                    contentMain3="accomplishments"
                    loadTimeout={this.props.loadTimeout * 2}
                />
                <ResumeSection
                    title="Education"
                    contentUrl="education.json"
                    contentLeft="location"
                    styleLeft={styleTitle}
                    contentCenter="school"
                    styleCenter={styleCompany}
                    contentRight="date"
                    styleRight={styleDate}
                    contentLeftBottom="degree"
                    styleLeftBottom={styleSubhead}
                    contentCenterBottom="link"
                    styleCenterBottom={styleMainLink}
                    contentRightBottom="gpa"
                    styleRightBottom={styleSubhead}
                    contentMain="curriculum"
                    styleMain={styleBulletlessList}
                    loadTimeout={this.props.loadTimeout * 1}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <ResumeBox loadTimeout={250} />,
    document.getElementById('resume')
);