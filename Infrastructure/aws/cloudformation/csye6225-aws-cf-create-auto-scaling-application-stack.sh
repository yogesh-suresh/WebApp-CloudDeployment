#User Inputs:
echo "Please enter Auto Scaling Stack Name:"
read autoScaleStackName
if [ -z "$autoScaleStackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$autoScaleStackName"

echo "Please enter Network Stack Name:"
read networkStackName
if [ -z "$networkStackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$networkStackName"

echo "Please enter an active keyPair to associate with EC2:"
read keyName
if [ -z "$keyName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$keyName"

#Domain name of namecheap
echo "Please enter Domain name of namecheap for S3Bucket Name:"
read domainname
if [ -z "$domainname" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$domainname"

#rds MasterUsername
echo "Please enter RDS Username:"
read rdsUsername
if [ -z "$rdsUsername" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$rdsUsername"

#rds password
echo "Please enter RDS Password:"
read rdsPassword
if [ -z "$rdsPassword" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$rdsPassword"

#Hostedzone id
echo "Please enter Hosted zone ID:"
read hostedZOneId
if [ -z "$hostedZOneId" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$hostedZOneId"

#SSL id
echo "Please enter SSL certificate ID:"
read sslCertId
if [ -z "$sslCertId" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$sslCertId"

echo "Please enter IP Address(CIDR notation) that AWS WAF blocks:"
read IPAddressToBlock
if [ -z "$IPAddressToBlock" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$IPAddressToBlock"


# Create CloudFormation Stack
echo "Validating template"
TMP_code=`aws cloudformation validate-template --template-body file://./csye6225-cf-auto-scaling-application.json`
if [ -z "$TMP_code" ]
then
	echo "Template error exiting!"
	exit 1
fi
echo "Cloudformation template validation success"

echo "Now Creating CloudFormation Stack"

CRTSTACK_Code=`aws cloudformation create-stack --stack-name $autoScaleStackName --template-body file://./csye6225-cf-auto-scaling-application.json --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=NetworkStackNameParameter,ParameterValue=$networkStackName ParameterKey=DomainNameParameter,ParameterValue=$domainname ParameterKey=RDSUserName,ParameterValue=$rdsUsername ParameterKey=RDSPassword,ParameterValue=$rdsPassword ParameterKey=HostedZoneId,ParameterValue=$hostedZOneId ParameterKey=SSLCertificateId,ParameterValue=$sslCertId ParameterKey=KeyName,ParameterValue=$keyName ParameterKey=IPAddressToBlock,ParameterValue=$IPAddressToBlock`

if [ -z "$CRTSTACK_Code" ]
then
	echo "Stack Creation error exiting!"
	exit 1
fi

aws cloudformation wait stack-create-complete --stack-name $autoScaleStackName
echo "Auto Scaling Application Stack Created"
echo "Check AWS Cloudformation"
