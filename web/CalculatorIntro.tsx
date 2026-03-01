import { Button, Container, Link, styled } from "@mui/material";
import parse, { domToReact, Element } from "html-react-parser";
import { memo } from "react";
import { msgs, S } from "./CalculatorL10n";
import { InlineDiv } from "./CalculatorStyled";

const CenterSection = styled("section")({
    textAlign: "center",
});

const parseOptions = {
    replace: (node: Element) => {
        if (node.tagName === "a") {
            return <Link href={node.attribs.href} target={node.attribs.target}>{domToReact(node.children as any, parseOptions)}</Link>;
        }
    }
};

const Desc = memo(() => (<section>{parse(msgs[S.c_wizard_text], parseOptions)}</section>));

export default memo(({ exit }: { exit: () => void }) => {
    return (
        <Container>
            <CenterSection>
                <h1>{msgs[S.app_name]}</h1>
                <p>{msgs[S.c_first_start_text_1]}</p>
                <p>{msgs[S.c_first_start_text_2]}</p>
                <br />
                <InlineDiv>
                    <Button
                        onClick={exit}
                        variant="contained">
                        {msgs[S.cpp_wizard_next]}
                    </Button>
                </InlineDiv>
            </CenterSection>
            <br /><br />
            <Desc />
            <CenterSection>
                <InlineDiv>
                    <Button
                        onClick={exit}
                        variant="contained">
                        {msgs[S.cpp_wizard_next]}
                    </Button>
                </InlineDiv>
                <br /><br />
            </CenterSection>
        </Container>
    );
});
