class Component_CommandInterpreterShowMessageExtension extends gs.Component_CommandInterpreter {
    constructor() {
        super();
    }
    
    assignCommand(command) {
        switch(command.id) {
            case 'EIS.showMessageScript':
                command.execute = this.commandEISShowMessageScript;
                return command.execute;
            default:
                return super.assignCommand(command);
        }
    }
    
    commandEISShowMessageScript() {
        return super.commandShowMessage();
    }
}

gs.Component_CommandInterpreter = Component_CommandInterpreterShowMessageExtension;